import type { DispatchParams } from "./type_flyweight.js";

import { getRequestParams, createRequest } from "./type_flyweight.js";
import { setThrottler, getThrottleParams, shouldThrottle } from "./throttle.js";
import { getQueueParams, enqueue, Queueable } from "./queue.js";

interface HtmlRequestInterface {
	request: Request;
	action: string;
	abortController: AbortController;
}

interface HtmlRequestQueuedInterface extends HtmlRequestInterface {
	status: "queued";
	queueTarget: EventTarget;
}

interface HtmlRequestRequestedInterface extends HtmlRequestInterface {
	status: "requested";
}

interface HtmlRequestResolvedInterface extends HtmlRequestInterface {
	status: "resolved";
	response: Response;
	html: string;
}

interface HtmlRequestRejectedInterface extends HtmlRequestInterface {
	status: "rejected";
	error: any;
}

export type HtmlRequestState =
	| HtmlRequestQueuedInterface
	| HtmlRequestRejectedInterface
	| HtmlRequestRequestedInterface
	| HtmlRequestResolvedInterface;

export interface HtmlEventInterface {
	requestState: HtmlRequestState;
}

export class HtmlEvent extends Event implements HtmlEventInterface {
	requestState: HtmlRequestState;

	constructor(requestState: HtmlRequestState, eventInit?: EventInit) {
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
	let fetchParams: HtmlRequestInterface = {
		action,
		request,
		abortController,
	};

	// could be one function call in the queue module itself
	let queueParams = getQueueParams(dispatchParams);
	if (queueParams) {
		let { queueTarget } = queueParams;

		dispatchParams.target.dispatchEvent(
			new HtmlEvent({ status: "queued", queueTarget, ...fetchParams }),
		);

		return enqueue({
			fetchCallback: fetchHtml,
			fetchParams,
			dispatchParams,
			queueParams,
			abortController,
		});
	}

	fetchHtml(fetchParams, dispatchParams, abortController);
}

function fetchHtml(
	fetchParams: HtmlRequestInterface,
	dispatchParams: DispatchParams,
	abortController: AbortController,
): Promise<void> | undefined {
	if (abortController.signal.aborted) return;

	let { target, composed } = dispatchParams;

	let event = new HtmlEvent(
		{ status: "requested", ...fetchParams },
		{ bubbles: true, composed },
	);
	target.dispatchEvent(event);

	return fetch(fetchParams.request)
		.then(resolveResponseBody)
		.then(function ([response, html]) {
			let event = new HtmlEvent(
				{ status: "resolved", response, html, ...fetchParams },
				{ bubbles: true, composed },
			);
			target.dispatchEvent(event);
		})
		.catch(function (error: any) {
			let event = new HtmlEvent(
				{ status: "rejected", error, ...fetchParams },
				{ bubbles: true, composed },
			);
			target.dispatchEvent(event);
		});
}

function resolveResponseBody(response: Response): Promise<[Response, string]> {
	return Promise.all([response, response.text()]);
}
