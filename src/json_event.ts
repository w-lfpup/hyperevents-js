// asynchronous
// queue-able

// AFAIK we can't use an AbortController on a dynamic import
// but we can on a fetch

import type { DispatchParams } from "./type_flyweight.js";

import type {
	Queuable,
	QueueNextCallback,
	ShouldQueueParams,
} from "./queue.js";

import { shouldThrottle, setThrottler, getThrottleParams } from "./throttle.js";

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
	let { el, sourceEvent } = dispatchParams;
	let { type } = sourceEvent;

	let action = el.getAttribute(`${type}:action`);
	let url = el.getAttribute(`${type}:url`);

	if (url) {
		// let throttleParams = getThrottleParams(dispatchParams, "json", action);
		// if (shouldThrottle(dispatchParams, throttleParams)) return;
		// setThrottler(dispatchParams, throttleParams);
		// let abortController = new AbortController();
		// setThrottler(params, abortController);
		// if (shouldQueue(params)) {
		// 	let entry = new QueueableJson(params, abortController);
		// 	return enqueue(el, entry);
		// }
		// fetchJson(params, abortController);
	}
}

class QueueableJson implements Queuable {
	#params: ShouldQueueParams;
	#abortController: AbortController;

	constructor(params: ShouldQueueParams, abortController: AbortController) {
		this.#params = params;
		this.#abortController = abortController;
	}

	dispatch(queueNextCallback: QueueNextCallback) {
		fetchJson(this.#params, this.#abortController, queueNextCallback);
	}
}

function fetchJson(
	params: ShouldQueueParams,
	abortController: AbortController,
	queueNextCallback?: QueueNextCallback,
) {
	if (abortController.signal.aborted) return;
	let { url, action, el } = params;
	if (!url) return;

	// if timeout add to queue

	let req = new Request(url, {
		signal: AbortSignal.any([AbortSignal.timeout(500), abortController.signal]),
	});

	fetch(req)
		.then(function (response: Response) {
			return Promise.all([response, response.text()]);
		})
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
