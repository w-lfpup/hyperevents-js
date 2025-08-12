import type { DispatchParams, RequestParams } from "./type_flyweight.js";
import type {
	Queuable,
	QueueNextCallback,
	QueueParamsInterface,
} from "./queue.js";

import { getRequestParams } from "./type_flyweight.js";
import { setThrottler, getThrottleParams, shouldThrottle } from "./throttle.js";
import { getQueueParams, enqueue } from "./queue.js";

const eventInitDict: EventInit = { bubbles: true, composed: true };

interface JsonEventParamsInterface {
	request: Request;
	action: string | null;
}

// queued event
interface JsonEventThrottledInterface extends JsonEventParamsInterface {
	queueTarget: EventTarget;
	status: "throttled";
}

interface JsonEventQueuedInterface extends JsonEventParamsInterface {
	queueTarget: EventTarget;
	status: "queued";
}

interface JsonEventRequestedInterface extends JsonEventParamsInterface {
	status: "requested";
}

interface JsonEventResolvedInterface extends JsonEventParamsInterface {
	status: "resolved";
	response: Response;
	json: any;
}

interface JsonEventRejectedInterface extends JsonEventParamsInterface {
	status: "rejected";
	error: any;
}

type JsonEventState =
	| JsonEventThrottledInterface
	| JsonEventQueuedInterface
	| JsonEventRequestedInterface
	| JsonEventResolvedInterface
	| JsonEventRejectedInterface;

export interface JsonEventInterface {
	requestState: JsonEventState;
}

export class JsonEvent extends Event implements JsonEventInterface {
	requestState: JsonEventState;

	constructor(requestState: JsonEventState, eventInitDict?: EventInit) {
		super("#json", eventInitDict);
		this.requestState = requestState;
	}
}

export function dispatchJsonEvent(dispatchParams: DispatchParams) {
	let requestParams = getRequestParams(dispatchParams);
	if (!requestParams) return;

	let throttleParams = getThrottleParams(dispatchParams, "json");
	if (shouldThrottle(dispatchParams, requestParams, throttleParams)) return;

	let abortController = new AbortController();

	setThrottler(dispatchParams, requestParams, throttleParams, abortController);

	let request = createRequest(dispatchParams, requestParams, abortController);
	if (!request) return;

	let { action } = requestParams;
	let actionParams: JsonEventParamsInterface = { action, request };

	let queueParams = getQueueParams(dispatchParams);
	if (queueParams) {
		// separate function
		let { queueTarget } = queueParams;
		let { currentTarget } = dispatchParams;

		currentTarget.dispatchEvent(
			new JsonEvent({ status: "queued", queueTarget, ...actionParams }),
		);

		let entry = new QueueableJson({
			actionParams,
			dispatchParams,
			queueParams,
			abortController,
		});
		return enqueue(queueParams, entry);
	}

	fetchJson(dispatchParams, actionParams, abortController);
}

interface QueuableParams {
	actionParams: JsonEventParamsInterface;
	dispatchParams: DispatchParams;
	queueParams: QueueParamsInterface;
	abortController: AbortController;
}

// this could be smaller just as an old school function returns function
class QueueableJson implements Queuable {
	#params: QueuableParams;

	constructor(params: QueuableParams) {
		this.#params = params;
	}

	dispatch(queueNextCallback: QueueNextCallback) {
		let { actionParams, dispatchParams, queueParams, abortController } =
			this.#params;
		let { queueTarget } = queueParams;

		let promisedJson = fetchJson(
			dispatchParams,
			actionParams,
			abortController,
		)?.finally(function () {
			queueNextCallback(queueTarget);
		});

		if (!promisedJson) {
			queueNextCallback(queueTarget);
		}
	}
}

function createRequest(
	dispatchParams: DispatchParams,
	requestParams: RequestParams,
	abortController: AbortController,
): Request | undefined {
	let { formData } = dispatchParams;
	let { url, timeoutMs, method } = requestParams;

	let abortSignals = [abortController.signal];
	if (timeoutMs) abortSignals.push(AbortSignal.timeout(timeoutMs));

	if (url) {
		return new Request(url, {
			signal: AbortSignal.any(abortSignals),
			method: method ?? "GET",
			body: formData,
		});
	}
}

function fetchJson(
	params: DispatchParams,
	actionParams: JsonEventParamsInterface,
	abortController: AbortController,
): Promise<void> | undefined {
	if (abortController.signal.aborted) return;

	let { currentTarget } = params;

	let event = new JsonEvent(
		{ status: "requested", ...actionParams },
		eventInitDict,
	);
	currentTarget.dispatchEvent(event);

	return fetch(actionParams.request)
		.then(resolveResponseBody)
		.then(function ([response, json]) {
			let event = new JsonEvent(
				{ status: "resolved", response, json, ...actionParams },
				eventInitDict,
			);
			currentTarget.dispatchEvent(event);
		})
		.catch(function (error: any) {
			let event = new JsonEvent(
				{ status: "rejected", error, ...actionParams },
				eventInitDict,
			);
			currentTarget.dispatchEvent(event);
		});
}

function resolveResponseBody(response: Response): Promise<[Response, string]> {
	return Promise.all([response, response.json()]);
}
