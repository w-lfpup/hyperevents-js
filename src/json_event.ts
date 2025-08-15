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

export type JsonEventState =
	| JsonEventQueuedInterface
	| JsonEventRequestedInterface
	| JsonEventResolvedInterface
	| JsonEventRejectedInterface;

export interface JsonEventInterface {
	requestState: JsonEventState;
}

interface QueuableParams {
	actionParams: JsonEventParamsInterface;
	dispatchParams: DispatchParams;
	queueParams: QueueParamsInterface;
	abortController: AbortController;
}

export class JsonEvent extends Event implements JsonEventInterface {
	requestState: JsonEventState;

	constructor(requestState: JsonEventState, eventInitDict?: EventInit) {
		super("#json", eventInitDict);
		this.requestState = requestState;
	}
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
		let { queueTarget } = queueParams;

		dispatchParams.currentTarget.dispatchEvent(
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

// duplicate function
function createRequest(
	dispatchParams: DispatchParams,
	requestParams: RequestParams,
	abortController: AbortController,
): Request | undefined {
	let { url, timeoutMs, method } = requestParams;
	if (!url) return;

	let abortSignals = [abortController.signal];
	if (timeoutMs) abortSignals.push(AbortSignal.timeout(timeoutMs));

	return new Request(url, {
		signal: AbortSignal.any(abortSignals),
		method: method ?? "GET",
		body: dispatchParams.formData,
	});
}

function fetchJson(
	dispatchParams: DispatchParams,
	actionParams: JsonEventParamsInterface,
	abortController: AbortController,
): Promise<void> | undefined {
	if (abortController.signal.aborted) return;

	let { currentTarget, composed } = dispatchParams;

	let event = new JsonEvent(
		{ status: "requested", ...actionParams },
		{ bubbles: true, composed },
	);
	currentTarget.dispatchEvent(event);

	return fetch(actionParams.request)
		.then(resolveResponseBody)
		.then(function ([response, json]) {
			let event = new JsonEvent(
				{ status: "resolved", response, json, ...actionParams },
				{ bubbles: true, composed },
			);
			currentTarget.dispatchEvent(event);
		})
		.catch(function (error: any) {
			let event = new JsonEvent(
				{ status: "rejected", error, ...actionParams },
				{ bubbles: true, composed },
			);
			currentTarget.dispatchEvent(event);
		});
}

function resolveResponseBody(response: Response): Promise<[Response, string]> {
	return Promise.all([response, response.json()]);
}
