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
	url: string;
	action: string | null;
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
	| JsonEventRejectedInterface
	| JsonEventRequestedInterface
	| JsonEventResolvedInterface;

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

	let queueParams = getQueueParams(dispatchParams);
	if (queueParams) {
		let entry = new QueueableJson(
			dispatchParams,
			requestParams,
			queueParams,
			abortController,
		);
		return enqueue(queueParams, entry);
	}

	fetchJson(dispatchParams, requestParams, abortController);
}

class QueueableJson implements Queuable {
	#dispatchParams: DispatchParams;
	#requestParams: RequestParams;
	#queueParams: QueueParamsInterface;
	#abortController: AbortController;

	constructor(
		dispatchParams: DispatchParams,
		requestParams: RequestParams,
		queueParams: QueueParamsInterface,
		abortController: AbortController,
	) {
		this.#dispatchParams = dispatchParams;
		this.#requestParams = requestParams;
		this.#queueParams = queueParams;
		this.#abortController = abortController;
	}

	dispatch(queueNextCallback: QueueNextCallback) {
		let { queueTarget } = this.#queueParams;

		let promisedJson = fetchJson(
			this.#dispatchParams,
			this.#requestParams,
			this.#abortController,
		)?.finally(function () {
			queueNextCallback(queueTarget);
		});

		if (!promisedJson) {
			queueNextCallback(queueTarget);
		}
	}
}

function fetchJson(
	params: DispatchParams,
	requestParams: RequestParams,
	abortController: AbortController,
): Promise<void> | undefined {
	let { currentTarget, formData } = params;
	let { url, action, timeoutMs, method } = requestParams;

	if (abortController.signal.aborted || !url || !currentTarget) return;

	let abortSignals = [abortController.signal];
	if (timeoutMs) abortSignals.push(AbortSignal.timeout(timeoutMs));

	let request = new Request(url, {
		signal: AbortSignal.any(abortSignals),
		method: method ?? "GET",
		body: formData,
	});

	let actionParams = { action, request, url };
	let event = new JsonEvent(
		{ status: "requested", ...actionParams },
		eventInitDict,
	);
	currentTarget.dispatchEvent(event);

	return fetch(request)
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
