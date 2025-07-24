// asynchronous
// queue-able

// AFAIK we can't use an AbortController on a dynamic import
// but we can on a fetch

import type {
	Queuable,
	QueueNextCallback,
	ShouldQueueParams,
} from "./queue.js";

import { shouldThrottle, setThrottler } from "./throttle.js";
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

export function dispatchJsonEvent(
	el: Element,
	currentTarget: Event["currentTarget"],
	kind: string,
) {
	let action = el.getAttribute(`${kind}:action`);
	let url = el.getAttribute(`${kind}:url`);

	if (url) {
		let params = { prefix: "json", el, currentTarget, kind, action, url };
		if (shouldThrottle(params)) return;

		let abortController = new AbortController();

		setThrottler(params, abortController);

		if (shouldQueue(params)) {
			let entry = new QueueableJson(params, abortController);
			enqueue(el, entry);
			// enqueue(el, getQueuable(params, abortController));
		}
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
		if (this.#abortController.signal.aborted) return;
		let { url, action, el } = this.#params;
		if (!url) return;

		// if timeout add to queue

		let req = new Request(url, {
			signal: AbortSignal.any([
				AbortSignal.timeout(500),
				this.#abortController.signal,
			]),
		});

		fetch(req)
			.then(function (response: Response) {
				return Promise.all([response, response.clone().text()]);
			})
			.then(function ([response, jsonStr]) {
				let event = new JsonEvent(
					{ response, action, jsonStr },
					{ bubbles: true },
				);
				el.dispatchEvent(event);
			})
			.catch(function (reason: any) {
				console.log("#json error!");
			})
			.finally(function () {
				queueNextCallback(el);
			});
	}
}

// function getQueuable(
// 	params: ShouldQueueParams,
// 	abortController: AbortController,
// ) {
// 	return function queuedCallback(queueNextCallback: QueueNextCallback) {
// 		if (abortController.signal.aborted) return;
// 		let { url, action, el } = params;
// 		if (!url) return;

// 		// if timeout add to queue

// 		let req = new Request(url, {
// 			signal: AbortSignal.any([
// 				AbortSignal.timeout(500),
// 				abortController.signal,
// 			]),
// 		});

// 		fetch(req)
// 			.then(function (response: Response) {
// 				return Promise.all([response, response.text()]);
// 			})
// 			.then(function ([response, jsonStr]) {
// 				let event = new JsonEvent(
// 					{ response, action, jsonStr },
// 					{ bubbles: true },
// 				);
// 				el.dispatchEvent(event);
// 			})
// 			.catch(function (reason: any) {
// 				console.log("#json error!");
// 			})
// 			.finally(function () {
// 				queueNextCallback(el);
// 			});
// 	}
// }
