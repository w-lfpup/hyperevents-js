// asynchronous
// queue-able

// could leave a "status=pending|fulfilled|rejected status:code=200|400|500

// AFAIK we can't use an AbortController on a dynamic import
// but we can on a fetch

import type { DispatchParams } from "./type_flyweight.js";

import { getRequestParams, createRequest } from "./type_flyweight.js";
import { setThrottler, getThrottleParams, shouldThrottle } from "./throttle.js";
import { getQueueParams, enqueue, Queueable } from "./queue.js";

interface HtmlEventParamsInterface {
	request: Request;
	action: ReturnType<Element["getAttribute"]>;
}

interface HtmlEventQueuedInterface extends HtmlEventParamsInterface {
	queueTarget: EventTarget;
	status: "queued";
}

interface HtmlEventRequestedInterface extends HtmlEventParamsInterface {
	status: "requested";
}

interface HtmlEventResolvedInterface extends HtmlEventParamsInterface {
	status: "resolved";
	response: Response;
	html: HTMLTemplateElement;
}

interface HtmlEventRejectedInterface extends HtmlEventParamsInterface {
	status: "rejected";
	error: any;
}

export type HtmlEventState =
	| HtmlEventQueuedInterface
	| HtmlEventRejectedInterface
	| HtmlEventRequestedInterface
	| HtmlEventResolvedInterface;

export interface HtmlEventInterface {
	readonly htmlParams: HtmlEventParamsInterface;
}

export class HtmlEvent extends Event {
	requestState: HtmlEventState;

	constructor(requestState: HtmlEventState, eventInit?: EventInit) {
		super("#html", eventInit);
		this.requestState = requestState;
	}
}

export function dispatchHtmlEvent(dispatchParams: DispatchParams) {
	let requestParams = getRequestParams(dispatchParams);
	if (!requestParams) return;

	let throttleParams = getThrottleParams(dispatchParams, "html");
	// if (shouldThrottle(dispatchParams, requestParams, throttleParams)) return;
	if (shouldThrottle(dispatchParams, throttleParams)) return;

	let abortController = new AbortController();

	// setThrottler(dispatchParams, requestParams, throttleParams, abortController);
	setThrottler(dispatchParams, throttleParams, abortController);

	let request = createRequest(dispatchParams, requestParams, abortController);
	if (!request) return;

	let { action } = requestParams;
	let fetchParams: HtmlEventParamsInterface = { action, request };

	let queueParams = getQueueParams(dispatchParams);
	if (queueParams) {
		let entry = new Queueable({
			fetchCallback: fetchHtml,
			dispatchParams,
			queueParams,
			fetchParams,
			abortController,
		});
		return enqueue(queueParams, entry);
	}

	fetchHtml(dispatchParams, abortController, fetchParams);
}

function fetchHtml(
	dispatchParams: DispatchParams,
	abortController: AbortController,
	actionParams: HtmlEventParamsInterface,
): Promise<void> | undefined {
	if (abortController.signal.aborted) return;

	let { currentTarget, composed } = dispatchParams;

	let event = new HtmlEvent(
		{ status: "requested", ...actionParams },
		{ bubbles: true, composed },
	);
	currentTarget.dispatchEvent(event);

	return fetch(actionParams.request)
		.then(resolveResponseBody)
		.then(function ([response, htmlStr]) {
			let html = new HTMLTemplateElement();
			html.innerHTML = htmlStr;

			let event = new HtmlEvent(
				{ status: "resolved", response, html, ...actionParams },
				{ bubbles: true, composed },
			);
			currentTarget.dispatchEvent(event);
		})
		.catch(function (error: any) {
			let event = new HtmlEvent(
				{ status: "rejected", error, ...actionParams },
				{ bubbles: true, composed },
			);
			currentTarget.dispatchEvent(event);
		});
}

function resolveResponseBody(response: Response): Promise<[Response, string]> {
	return Promise.all([response, response.text()]);
}
