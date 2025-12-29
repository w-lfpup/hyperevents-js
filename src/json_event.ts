import type { DispatchParams, FetchParamsInterface } from "./type_flyweight.js";
import type { QueableAtom } from "./queue.js";

import { createFetchParams } from "./type_flyweight.js";
import { throttled } from "./throttle.js";
import { queued } from "./queue.js";

interface JsonRequestQueuedInterface extends FetchParamsInterface {
	status: "queued";
	queueTarget: EventTarget;
}

interface JsonRequestRequestedInterface extends FetchParamsInterface {
	status: "requested";
}

interface JsonRequestResolvedInterface extends FetchParamsInterface {
	status: "resolved";
	response: Response;
	json: any;
}

interface JsonRequestRejectedInterface extends FetchParamsInterface {
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

class JsonFetch implements QueableAtom {
	#dispatchParams;
	#fetchParams;

	constructor(
		dispatchParams: DispatchParams,
		fetchParams: FetchParamsInterface,
	) {
		this.#dispatchParams = dispatchParams;
		this.#fetchParams = fetchParams;
	}

	dispatchQueuedEvent(): void {}

	async fetch(): Promise<void> {
		fetchJson(this.#dispatchParams, this.#fetchParams);
	}
}

export function dispatchJsonEvent(dispatchParams: DispatchParams) {
	let fetchParams = createFetchParams(dispatchParams);
	if (!fetchParams) return;

	if (throttled(dispatchParams, fetchParams)) return;

	let jsonFetch = new JsonFetch(dispatchParams, fetchParams);
	if (queued(dispatchParams, jsonFetch)) return;

	jsonFetch.fetch();
}

// turn this into object
function fetchJson(
	dispatchParams: DispatchParams,
	fetchParams: FetchParamsInterface,
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
