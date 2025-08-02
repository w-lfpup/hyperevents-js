/*

*/

import type {
	DispatchParams,
	RequestParams,
	RequestStatus,
} from "./type_flyweight.js";
import type { Queuable, QueueNextCallback } from "./queue.js";

import { getRequestParams } from "./type_flyweight.js";
import { setThrottler, getThrottleParams, shouldThrottle } from "./throttle.js";
import { shouldQueue, enqueue } from "./queue.js";

const eventInitDict: EventInit = { bubbles: true, composed: true };

export interface JsonEventParamsInterface {
	request: Request;
	response?: Response;
	jsonStr?: string;
	action?: string | null;
	error?: any;
}

export interface JsonEventInterface {
	readonly jsonParams: JsonEventParamsInterface;
}

export class JsonEvent extends Event {
	#params: JsonEventParamsInterface | undefined;
	#status: RequestStatus;

	constructor(
		params: JsonEventParamsInterface | undefined,
		status: RequestStatus,
		eventInit?: EventInit,
	) {
		super("#json", eventInit);
		this.#params = params;
		this.#status = status;
	}

	get status() {
		return this.#status;
	}

	get jsonStr(): string | undefined {
		return this.#params?.jsonStr;
	}
}

export function dispatchJsonEvent(dispatchParams: DispatchParams) {
	let requestParams = getRequestParams(dispatchParams);
	if (!requestParams) return;

	let throttleParams = getThrottleParams(dispatchParams, "json");
	if (shouldThrottle(dispatchParams, requestParams, throttleParams)) return;

	let abortController = new AbortController();

	setThrottler(dispatchParams, requestParams, throttleParams, abortController);

	let queueTarget = shouldQueue(dispatchParams);
	if (queueTarget) {
		let entry = new QueueableJson(
			dispatchParams,
			requestParams,
			abortController,
		);
		return enqueue(queueTarget, entry);
	}

	fetchJson(dispatchParams, requestParams, abortController);
}

class QueueableJson implements Queuable {
	#dispatchParams: DispatchParams;
	#requestParams: RequestParams;
	#abortController: AbortController;

	constructor(
		dispatchParams: DispatchParams,
		requestParams: RequestParams,
		abortController: AbortController,
	) {
		this.#dispatchParams = dispatchParams;
		this.#requestParams = requestParams;
		this.#abortController = abortController;
	}

	dispatch(queueNextCallback: QueueNextCallback) {
		fetchJson(
			this.#dispatchParams,
			this.#requestParams,
			this.#abortController,
			queueNextCallback,
		);
	}
}

function fetchJson(
	params: DispatchParams,
	requestParams: RequestParams,
	abortController: AbortController,
	queueNextCallback?: QueueNextCallback,
) {
	let { el, formData } = params;
	let { url, action, timeoutMs, method } = requestParams;

	if (abortController.signal.aborted || !url) {
		queueNextCallback?.(el);
	} else {
		let abortSignals = [abortController.signal];
		if (timeoutMs) abortSignals.push(AbortSignal.timeout(timeoutMs));

		let request = new Request(url, {
			signal: AbortSignal.any(abortSignals),
			method: method ?? "GET",
			body: formData,
		});

		let event = new JsonEvent({ action, request }, "requested", eventInitDict);
		el.dispatchEvent(event);

		fetch(request)
			.then(resolveResponseBody)
			.then(function ([response, jsonStr]) {
				let event = new JsonEvent(
					{ request, action, response, jsonStr },
					"resolved",
					eventInitDict,
				);
				el.dispatchEvent(event);
			})
			.catch(function (error: any) {
				let event = new JsonEvent(
					{ request, action, error },
					"rejected",
					eventInitDict,
				);
				el.dispatchEvent(event);
			})
			.finally(function () {
				queueNextCallback?.(el);
			});
	}
}

function resolveResponseBody(response: Response): Promise<[Response, string]> {
	return Promise.all([response, response.text()]);
}
