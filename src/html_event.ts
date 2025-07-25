// asynchronous
// queue-able

// could leave a "status=pending|fulfilled|rejected status:code=200|400|500

// AFAIK we can't use an AbortController on a dynamic import
// but we can on a fetch

import type { DispatchParams, RequestParams } from "./type_flyweight.js";

import type { Queuable, QueueNextCallback } from "./queue.js";

import { getRequestParams } from "./type_flyweight.js";
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
	let reqParams = getRequestParams(dispatchParams);
	if (!reqParams) return;

	let throttleParams = getThrottleParams(dispatchParams, reqParams, "json");

	let abortController = new AbortController();

	if (throttleParams)
		setThrottler(dispatchParams, reqParams, throttleParams, abortController);

	let queueTarget = shouldQueue(dispatchParams);
	if (queueTarget) {
		let entry = new QueueableHtml(dispatchParams, reqParams, abortController);
		return enqueue(queueTarget, entry);
	}

	fetchHtml(dispatchParams, reqParams, abortController);
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
			.then(function ([response, html]) {
				let event = new HtmlEvent({ response, html }, { bubbles: true });
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
