import type { DispatchParams } from "./type_flyweight.js";

import { getRequestParams, createRequest } from "./type_flyweight.js";
import { setThrottler, getThrottleParams, shouldThrottle } from "./throttle.js";
import { getQueueParams, enqueue, Queueable } from "./queue.js";

interface JsonEventParamsInterface {
	request: Request;
	action: string | null;
}

interface JsonEventQueuedInterface extends JsonEventParamsInterface {
	queueTarget: EventTarget;
	status: "queued";
}

interface JsonEventRequestedInterface extends JsonEventParamsInterface {
	status: "requested";
}

interface JsonEventResolvedInterface extends JsonEventParamsInterface {
	status: "resolved";
	response: Response;
	json: any;
}

interface JsonEventRejectedInterface extends JsonEventParamsInterface {
	status: "rejected";
	error: any;
}

export type JsonEventState =
	| JsonEventQueuedInterface
	| JsonEventRequestedInterface
	| JsonEventResolvedInterface
	| JsonEventRejectedInterface;

export interface JsonEventInterface {
	requestState: JsonEventState;
}

export class JsonEvent extends Event implements JsonEventInterface {
	requestState: JsonEventState;

	constructor(requestState: JsonEventState, eventInitDict?: EventInit) {
		super("#json", eventInitDict);
		this.requestState = requestState;
	}
}

export function dispatchJsonEvent(dispatchParams: DispatchParams) {
	let requestParams = getRequestParams(dispatchParams);
	if (!requestParams) return;

	let throttleParams = getThrottleParams(dispatchParams, "json");
	if (shouldThrottle(dispatchParams, throttleParams)) return;

	let abortController = new AbortController();

	setThrottler(dispatchParams, throttleParams, abortController);

	let request = createRequest(dispatchParams, requestParams, abortController);
	if (!request) return;

	let { action } = requestParams;
	let fetchParams: JsonEventParamsInterface = { action, request };

	let queueParams = getQueueParams(dispatchParams);
	if (queueParams) {
		let { queueTarget } = queueParams;

		dispatchParams.currentTarget.dispatchEvent(
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

	fetchJson(dispatchParams, abortController, fetchParams);
}

function fetchJson(
	dispatchParams: DispatchParams,
	abortController: AbortController,
	actionParams: JsonEventParamsInterface,
): Promise<void> | undefined {
	if (abortController.signal.aborted) return;

	let { el, composed } = dispatchParams;

	let event = new JsonEvent(
		{ status: "requested", ...actionParams },
		{ bubbles: true, composed },
	);
	el.dispatchEvent(event);

	return fetch(actionParams.request)
		.then(resolveResponseBody)
		.then(function ([response, json]) {
			let event = new JsonEvent(
				{ status: "resolved", response, json, ...actionParams },
				{ bubbles: true, composed },
			);
			el.dispatchEvent(event);
		})
		.catch(function (error: any) {
			let event = new JsonEvent(
				{ status: "rejected", error, ...actionParams },
				{ bubbles: true, composed },
			);
			el.dispatchEvent(event);
		});
}

function resolveResponseBody(response: Response): Promise<[Response, string]> {
	return Promise.all([response, response.json()]);
}
