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
import { getQueueParams, enqueue } from "./queue.js";

// queued event
// interface JsonEventQueuedInterface extends JsonEventParamsInterface {
// 	status: "queued";
// }

interface HtmlEventParamsInterface {
	request: Request;
	url: string;
	action: string | null;
	targeted: Element[];
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
	| HtmlEventRejectedInterface
	| HtmlEventRequestedInterface
	| HtmlEventResolvedInterface;

export interface HtmlEventInterface {
	readonly htmlParams: HtmlEventParamsInterface;
}

const eventInitDict: EventInit = { bubbles: true, composed: true };

export class HtmlEvent extends Event {
	#requestState: RequestStatus;

	constructor(requestState: RequestStatus, eventInit?: EventInit) {
		super("#html", eventInit);
		// this.#params = params;
		this.#requestState = requestState;
	}

	get requestState() {
		return this.#requestState;
	}
}

// projection="swap"
// projection-target="match | querySelector | querySelectorAll"
// projection-selector="ul"

// status-target="match | querySelector | querySelectorAll" | default is querySelector
// status-selector="selector" pending | completed

// get html params implements throttle params

/*
	{
		html as text,
		fragment as DomFragment,
		targetElements: Element[],
		projection: "swap",
		disconnected: [],
	}
*/

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

	// get target nodes
	// match or querySelector or querySelectorAll or _document _currentTarget _target
	// match walks up the parent nodes and matches the selector against the element, stops at currentTarget
	// querySelector does it's thing
	// querySelectorAll likewise

	let queueTarget = getQueueParams(dispatchParams);
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

		let event = new HtmlEvent("requested", eventInitDict);
		el.dispatchEvent(event);

		fetch(req)
			.then(resolveResponseBody)
			.then(function ([response, html]) {
				let event = new HtmlEvent("resolved", eventInitDict);
				el.dispatchEvent(event);
			})
			.catch(function (_reason: any) {
				let event = new HtmlEvent("rejected", eventInitDict);
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
