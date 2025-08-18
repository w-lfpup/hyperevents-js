import type { DispatchParams } from "./type_flyweight.js";

import { getRequestParams, createRequest } from "./type_flyweight.js";
import { setThrottler, getThrottleParams, shouldThrottle } from "./throttle.js";
import { getQueueParams, enqueue, Queueable } from "./queue.js";

interface HtmlEventParamsInterface {
	request: Request;
	action: string;
	abortController: AbortController;
}

interface HtmlEventQueuedInterface extends HtmlEventParamsInterface {
	status: "queued";
	queueTarget: EventTarget;
}

interface HtmlEventRequestedInterface extends HtmlEventParamsInterface {
	status: "requested";
}

interface HtmlEventResolvedInterface extends HtmlEventParamsInterface {
	status: "resolved";
	response: Response;
	html: string;
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
	htmlParams: HtmlEventParamsInterface;
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

	let throttleParams = getThrottleParams(dispatchParams);
	if (shouldThrottle(dispatchParams, throttleParams)) return;

	let abortController = new AbortController();

	setThrottler(dispatchParams, throttleParams, abortController);

	let request = createRequest(dispatchParams, requestParams, abortController);
	if (!request) return;

	let { action } = requestParams;
	let fetchParams: HtmlEventParamsInterface = {
		action,
		request,
		abortController,
	};

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

	fetchHtml(fetchParams, dispatchParams, abortController);
}

function fetchHtml(
	fetchParams: HtmlEventParamsInterface,
	dispatchParams: DispatchParams,
	abortController: AbortController,
): Promise<void> | undefined {
	if (abortController.signal.aborted) return;

	let { el, composed } = dispatchParams;

	let event = new HtmlEvent(
		{ status: "requested", ...fetchParams },
		{ bubbles: true, composed },
	);
	el.dispatchEvent(event);

	return fetch(fetchParams.request)
		.then(resolveResponseBody)
		.then(function ([response, html]) {
			let event = new HtmlEvent(
				{ status: "resolved", response, html, ...fetchParams },
				{ bubbles: true, composed },
			);
			el.dispatchEvent(event);
		})
		.catch(function (error: any) {
			let event = new HtmlEvent(
				{ status: "rejected", error, ...fetchParams },
				{ bubbles: true, composed },
			);
			el.dispatchEvent(event);
		});
}

function resolveResponseBody(response: Response): Promise<[Response, string]> {
	return Promise.all([response, response.text()]);
}
