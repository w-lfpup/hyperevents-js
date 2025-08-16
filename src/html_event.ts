// asynchronous
// queue-able

// could leave a "status=pending|fulfilled|rejected status:code=200|400|500

// AFAIK we can't use an AbortController on a dynamic import
// but we can on a fetch

import type { DispatchParams, RequestParams } from "./type_flyweight.js";
import type {
	Queuable,
	QueueNextCallback,
	QueueParamsInterface,
} from "./queue.js";

import { getRequestParams } from "./type_flyweight.js";
import { setThrottler, getThrottleParams, shouldThrottle } from "./throttle.js";
import { getQueueParams, enqueue } from "./queue.js";

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
	readonly htmlParams: HtmlEventParamsInterface;
}

interface QueuableParams {
	htmlParams: HtmlEventParamsInterface;
	dispatchParams: DispatchParams;
	queueParams: QueueParamsInterface;
	abortController: AbortController;
}

export class HtmlEvent extends Event {
	requestState: HtmlEventState;

	constructor(requestState: HtmlEventState, eventInit?: EventInit) {
		super("#html", eventInit);
		this.requestState = requestState;
	}
}

class QueueableHtml implements Queuable {
	#params: QueuableParams;

	constructor(params: QueuableParams) {
		this.#params = params;
	}

	dispatch(queueNextCallback: QueueNextCallback) {
		let { htmlParams, dispatchParams, queueParams, abortController } =
			this.#params;
		let { queueTarget } = queueParams;

		let promisedJson = fetchHtml(
			dispatchParams,
			htmlParams,
			abortController,
		)?.finally(function () {
			queueNextCallback(queueTarget);
		});

		if (!promisedJson) {
			queueNextCallback(queueTarget);
		}
	}
}

export function dispatchHtmlEvent(dispatchParams: DispatchParams) {
	let requestParams = getRequestParams(dispatchParams);
	if (!requestParams) return;

	let throttleParams = getThrottleParams(dispatchParams, "html");
	if (shouldThrottle(dispatchParams, requestParams, throttleParams)) return;

	let abortController = new AbortController();

	setThrottler(dispatchParams, requestParams, throttleParams, abortController);

	let request = createRequest(dispatchParams, requestParams, abortController);
	if (!request) return;

	let { action } = requestParams;
	let htmlParams: HtmlEventParamsInterface = { action, request };

	let queueParams = getQueueParams(dispatchParams);
	if (queueParams) {
		let entry = new QueueableHtml({
			dispatchParams,
			queueParams,
			htmlParams,
			abortController,
		});
		return enqueue(queueParams, entry);
	}

	fetchHtml(dispatchParams, htmlParams, abortController);
}

// duplicate function
function createRequest(
	dispatchParams: DispatchParams,
	requestParams: RequestParams,
	abortController: AbortController,
): Request | undefined {
	let { url, timeoutMs, method } = requestParams;
	if (!url) return;

	let abortSignals = [abortController.signal];
	if (timeoutMs) abortSignals.push(AbortSignal.timeout(timeoutMs));

	return new Request(url, {
		signal: AbortSignal.any(abortSignals),
		method: method ?? "GET",
		body: dispatchParams.formData,
	});
}

function fetchHtml(
	dispatchParams: DispatchParams,
	actionParams: HtmlEventParamsInterface,
	abortController: AbortController,
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
		.then(function ([response, html]) {
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
