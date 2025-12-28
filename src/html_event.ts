import type { DispatchParams, FetchParamsInterface } from "./type_flyweight.js";

import { getRequestParams, createFetchParams } from "./type_flyweight.js";
import { setThrottler, getThrottleParams, shouldThrottle } from "./throttle.js";
import { getQueueParams, enqueue, Queueable } from "./queue.js";

interface HtmlRequestQueuedInterface extends FetchParamsInterface {
	status: "queued";
	queueTarget: EventTarget;
}

interface HtmlRequestRequestedInterface extends FetchParamsInterface {
	status: "requested";
}

interface HtmlRequestResolvedInterface extends FetchParamsInterface {
	status: "resolved";
	response: Response;
	html: string;
}

interface HtmlRequestRejectedInterface extends FetchParamsInterface {
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
	// let throttleParams = getThrottleParams(dispatchParams);
	// if (shouldThrottle(dispatchParams, throttleParams)) return;

	// setThrottler(dispatchParams, throttleParams, abortController);

	let fetchParams = createFetchParams(dispatchParams);
	if (!fetchParams) return;

	// let queueParams = getQueueParams(dispatchParams);
	// if (queueParams) {
	// 	let { queueTarget } = queueParams;

	// 	dispatchParams.target.dispatchEvent(
	// 		new HtmlEvent({ status: "queued", queueTarget, ...fetchParams }),
	// 	);

	// 	return enqueue({
	// 		fetchCallback: fetchHtml,
	// 		fetchParams,
	// 		dispatchParams,
	// 		queueParams,
	// 		abortController,
	// 	});
	// }

	fetchHtml(dispatchParams, fetchParams);
}

function fetchHtml(
	dispatchParams: DispatchParams,
	fetchParams: FetchParamsInterface,
): Promise<void> | undefined {
	if (fetchParams.request.signal.aborted) return; // maybe?

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
