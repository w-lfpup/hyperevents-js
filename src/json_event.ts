// asynchronous
// queue-able

// AFAIK we can't use an AbortController on a dynamic import
// but we can on a fetch

import type { DispatchParams, RequestParams } from "./type_flyweight.js";
import type { Queuable, QueueNextCallback } from "./queue.js";

import { getRequestParams } from "./type_flyweight.js";
import { setThrottler, getThrottleParams } from "./throttle.js";
import { shouldQueue, enqueue } from "./queue.js";

export interface JsonEventParamsInterface {
	response: Response;
	jsonStr: string;
	action?: string | null;
}

export interface JsonEventInterface {
	readonly jsonParams: JsonEventParamsInterface;
}

export class JsonEvent extends Event implements JsonEventInterface {
	#params: JsonEventParamsInterface;

	constructor(params: JsonEventParamsInterface, eventInit?: EventInit) {
		super("#json", eventInit);
		this.#params = params;
	}

	get jsonParams() {
		return this.#params;
	}
}

export function dispatchJsonEvent(dispatchParams: DispatchParams) {
	// get request params
	let reqParams = getRequestParams(dispatchParams);
	if (!reqParams) return;

	let throttleParams = getThrottleParams(dispatchParams, reqParams, "json");

	let abortController = new AbortController();

	if (throttleParams)
		setThrottler(dispatchParams, reqParams, throttleParams, abortController);

	let queueTarget = shouldQueue(dispatchParams);
	if (queueTarget) {
		let entry = new QueueableJson(dispatchParams, reqParams, abortController);
		return enqueue(queueTarget, entry);
	}

	fetchJson(dispatchParams, reqParams, abortController);
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

	if (!abortController.signal.aborted && url) {
		// if timeout add to queue
		let abortSignals = [abortController.signal];
		if (timeoutMs) {
			abortSignals.push(AbortSignal.timeout(timeoutMs));
		}

		let req = new Request(url, {
			signal: AbortSignal.any(abortSignals),
			method: method ?? "GET",
			body: formData,
		});

		return fetch(req)
			.then(resolveResponseBody)
			.then(function ([response, jsonStr]) {
				let event = new JsonEvent(
					{ response, action, jsonStr },
					{ bubbles: true },
				);
				el.dispatchEvent(event);
			})
			.catch(function (_reason: any) {
				console.log("#json error!");
			})
			.finally(function () {
				if (queueNextCallback) queueNextCallback(el);
			});
	}

	if (queueNextCallback) queueNextCallback(el);
}

function resolveResponseBody(response: Response): Promise<[Response, string]> {
	return Promise.all([response, response.text()]);
}
