import type { DispatchParams } from "./type_flyweight.js";

import { getRequestParams, createRequest } from "./type_flyweight.js";
import { setThrottler, getThrottleParams, shouldThrottle } from "./throttle.js";
import { getQueueParams, enqueue, Queueable } from "./queue.js";

interface JsonRequestInterface {
	request: Request;
	action: string;
	abortController: AbortController;
}

interface JsonRequestQueuedInterface extends JsonRequestInterface {
	status: "queued";
	queueTarget: EventTarget;
}

interface JsonRequestRequestedInterface extends JsonRequestInterface {
	status: "requested";
}

interface JsonRequestResolvedInterface extends JsonRequestInterface {
	status: "resolved";
	response: Response;
	json: any;
}

interface JsonRequestRejectedInterface extends JsonRequestInterface {
	status: "rejected";
	error: any;
}

export type JsonRequestState =
	| JsonRequestQueuedInterface
	| JsonRequestRequestedInterface
	| JsonRequestResolvedInterface
	| JsonRequestRejectedInterface;

export interface JsonEventInterface {
	requestState: JsonRequestState;
}

export class JsonEvent extends Event implements JsonEventInterface {
	requestState: JsonRequestState;

	constructor(requestState: JsonRequestState, eventInitDict?: EventInit) {
		super("#json", eventInitDict);
		this.requestState = requestState;
	}
}

export function dispatchJsonEvent(dispatchParams: DispatchParams) {
	let requestParams = getRequestParams(dispatchParams);
	if (!requestParams) return;

	let throttleParams = getThrottleParams(dispatchParams);
	if (shouldThrottle(dispatchParams, throttleParams)) return;

	let abortController = new AbortController();

	setThrottler(dispatchParams, throttleParams, abortController);

	let request = createRequest(dispatchParams, requestParams, abortController);
	if (!request) return;

	let { action } = requestParams;
	let fetchParams: JsonRequestInterface = {
		action,
		request,
		abortController,
	};

	let queueParams = getQueueParams(dispatchParams);
	if (queueParams) {
		let { queueTarget } = queueParams;

		dispatchParams.target.dispatchEvent(
			new JsonEvent({ status: "queued", queueTarget, ...fetchParams }),
		);

		let entry = new Queueable({
			fetchCallback: fetchJson,
			fetchParams,
			dispatchParams,
			queueParams,
			abortController,
		});
		return enqueue(queueParams, entry);
	}

	fetchJson(fetchParams, dispatchParams, abortController);
}

function fetchJson(
	fetchParams: JsonRequestInterface,
	dispatchParams: DispatchParams,
	abortController: AbortController,
): Promise<void> | undefined {
	if (abortController.signal.aborted) return;

	let { target, composed } = dispatchParams;

	let event = new JsonEvent(
		{ status: "requested", ...fetchParams },
		{ bubbles: true, composed },
	);
	target.dispatchEvent(event);

	return fetch(fetchParams.request)
		.then(resolveResponseBody)
		.then(function ([response, json]) {
			let event = new JsonEvent(
				{ status: "resolved", response, json, ...fetchParams },
				{ bubbles: true, composed },
			);
			target.dispatchEvent(event);
		})
		.catch(function (error: any) {
			let event = new JsonEvent(
				{ status: "rejected", error, ...fetchParams },
				{ bubbles: true, composed },
			);
			target.dispatchEvent(event);
		});
}

function resolveResponseBody(response: Response): Promise<[Response, string]> {
	return Promise.all([response, response.json()]);
}
