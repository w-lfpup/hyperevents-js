// asynchronous
// queue-able

// could leave a "status=pending|fulfilled|rejected status:code=200|400|500

// AFAIK we can't use an AbortController on a dynamic import
// but we can on a fetch

import type {
	DispatchParams,
	RequestParams,
	RequestStatus,
} from "./type_flyweight.js";
import type { Queuable, QueueNextCallback } from "./queue.js";

import { getRequestParams } from "./type_flyweight.js";
import { setThrottler, getThrottleParams, shouldThrottle } from "./throttle.js";
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

export class HtmlEvent extends Event {
	// #params: HtmlEventParamsInterface;
	#status: RequestStatus;

	constructor(status: RequestStatus, eventInit?: EventInit) {
		super("#html", eventInit);
		// this.#params = params;
		this.#status = status;
	}

	// get htmlParams() {
	// 	return this.#params;
	// }

	get status() {
		return this.#status;
	}
}

// projection="swap"
// projection-target="match | querySelector | querySelectorAll"
// projection-selector="ul"

// status-target="match | querySelector | querySelectorAll" | default is querySelector
// status-selector="selector" pending | completed

export function dispatchHtmlEvent(dispatchParams: DispatchParams) {
	let requestParams = getRequestParams(dispatchParams);
	if (!requestParams) return;

	let throttleParams = getThrottleParams(dispatchParams, "html");
	if (shouldThrottle(dispatchParams, requestParams, throttleParams)) return;

	let abortController = new AbortController();

	if (throttleParams)
		setThrottler(
			dispatchParams,
			requestParams,
			throttleParams,
			abortController,
		);

	let queueTarget = shouldQueue(dispatchParams);
	if (queueTarget) {
		let entry = new QueueableHtml(
			dispatchParams,
			requestParams,
			abortController,
		);
		return enqueue(queueTarget, entry);
	}

	fetchHtml(dispatchParams, requestParams, abortController);
}

class QueueableHtml implements Queuable {
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
		fetchHtml(
			this.#dispatchParams,
			this.#requestParams,
			this.#abortController,
			queueNextCallback,
		);
	}
}

function fetchHtml(
	params: DispatchParams,
	requestParams: RequestParams,
	abortController: AbortController,
	queueNextCallback?: QueueNextCallback,
) {
	let { el, formData } = params;
	let { url, timeoutMs, method } = requestParams;

	if (abortController.signal.aborted || !url) {
		queueNextCallback?.(el);
	} else {
		// if timeout add to queue
		let abortSignals = [abortController.signal];
		if (timeoutMs) abortSignals.push(AbortSignal.timeout(timeoutMs));

		let req = new Request(url, {
			signal: AbortSignal.any(abortSignals),
			method: method ?? "GET",
			body: formData,
		});

		let event = new HtmlEvent(
			// { response, action, jsonStr },
			"requested",
			{ bubbles: true },
		);

		fetch(req)
			.then(resolveResponseBody)
			.then(function ([response, html]) {
				// do projection here
				let event = new HtmlEvent(
					// { response, action, jsonStr },
					"resolved",
					{ bubbles: true },
				);
				el.dispatchEvent(event);
			})
			.catch(function (_reason: any) {
				console.log("#json error!");
				let event = new HtmlEvent(
					// { response, action, jsonStr },
					"rejected",
					{ bubbles: true },
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
