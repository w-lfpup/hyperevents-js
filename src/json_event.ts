import type { DispatchParams } from "./type_flyweight.js";

import { getRequestParams, createRequest } from "./type_flyweight.js";
import { setThrottler, getThrottleParams, shouldThrottle } from "./throttle.js";
import { getQueueParams, enqueue } from "./queue.js";

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

	// this could be one function
	// let throttleParams = getThrottleParams(dispatchParams);
	// if (shouldThrottle(dispatchParams)) return;

	let abortController = new AbortController();

	// setThrottler(dispatchParams, throttleParams, abortController);

	let { action } = requestParams;
	let request = createRequest(dispatchParams, requestParams, abortController);

	let fetchParams: JsonRequestInterface = {
		action,
		request,
		abortController,
	};

	// let queueParams = getQueueParams(dispatchParams);
	// if (queueParams) {
	// 	let { queueTarget } = queueParams;

	// 	dispatchParams.target.dispatchEvent(
	// 		new JsonEvent({ status: "queued", queueTarget, ...fetchParams }),
	// 	);

	// 	return enqueue({
	// 		fetchCallback: fetchJson,
	// 		fetchParams,
	// 		dispatchParams,
	// 		queueParams,
	// 		abortController,
	// 	});
	// }

	fetchJson(fetchParams, dispatchParams);
}

function fetchJson(
	fetchParams: JsonRequestInterface,
	dispatchParams: DispatchParams,
): Promise<void> | undefined {
	if (fetchParams.request.signal.aborted) return; // maybe?

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

function resolveResponseBody(response: Response): Promise<[Response, any]> {
	return Promise.all([response, response.json()]);
}
