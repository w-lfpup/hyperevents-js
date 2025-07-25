// asynchronous
// queue-able

// could leave a "status=pending|fulfilled|rejected status:code=200|400|500

// AFAIK we can't use an AbortController on a dynamic import
// but we can on a fetch

import type { DispatchParams } from "./type_flyweight.js";

import type {
	Queuable,
	QueueNextCallback,
	ShouldQueueParams,
} from "./queue.js";

import { setThrottler, getThrottleParams } from "./throttle.js";
import { shouldQueue, enqueue } from "./queue.js";

export interface HtmlEventParamsInterface {
	response: Response;
	html: string;
	target?: Element;
	destination?: Element;
	projection?: string;
}

export interface HtmlEventInterface {
	readonly htmlParams: HtmlEventParamsInterface;
}

export class HtmlEvent extends Event implements HtmlEventInterface {
	#params: HtmlEventParamsInterface;

	constructor(params: HtmlEventParamsInterface, eventInit?: EventInit) {
		super("#html", eventInit);
		this.#params = params;
	}

	get htmlParams() {
		return this.#params;
	}
}

export function dispatchHtmlEvent(dispatchParams: DispatchParams) {
	let { el, sourceEvent } = dispatchParams;
	let { type } = sourceEvent;

	let url = el.getAttribute(`${type}:url`);

	if (url) {
		let throttleParams = getThrottleParams(dispatchParams, {
			prefix: "html",
			url,
		});

		let abortController = new AbortController();

		if (throttleParams)
			setThrottler(dispatchParams, throttleParams, abortController);

		// if (shouldQueue(params)) {
		// 	let entry = new QueueableHtml(params, abortController);
		// 	return enqueue(el, entry);
		// 	// enqueue(el, getQueuable(params, abortController));
		// }
		// fetchHtml(params, abortController);
	}
}

// class QueueableHtml implements Queuable {
// 	#params: ShouldQueueParams;
// 	#abortController: AbortController;

// 	constructor(params: ShouldQueueParams, abortController: AbortController) {
// 		this.#params = params;
// 		this.#abortController = abortController;
// 	}

// 	dispatch(queueNextCallback: QueueNextCallback) {
// 		fetchHtml(this.#params, this.#abortController, queueNextCallback);
// 	}
// }

// function fetchHtml(
// 	params: ShouldQueueParams,
// 	abortController: AbortController,
// 	queueNextCallback?: QueueNextCallback,
// ) {
// 	if (abortController.signal.aborted) return;
// 	let { url, action, el } = params;
// 	if (!url) return;

// 	// if timeout add to queue

// 	let req = new Request(url, {
// 		signal: AbortSignal.any([AbortSignal.timeout(500), abortController.signal]),
// 	});

// 	fetch(req)
// 		.then(function (response: Response) {
// 			return Promise.all([response, response.text()]);
// 		})
// 		.then(function ([response, html]) {
// 			let event = new HtmlEvent({ response, html }, { bubbles: true });
// 			el.dispatchEvent(event);
// 		})
// 		.catch(function () {
// 			console.log("#html error!");
// 		})
// 		.finally(function () {
// 			if (queueNextCallback) queueNextCallback(el);
// 		});
// }
