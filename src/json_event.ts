declare global {
	interface GlobalEventHandlersEventMap {
		["#json"]: JsonEventInterface;
	}
}

import type { DispatchParams, FetchParamsInterface } from "./type_flyweight.js";
import type { Queueable } from "./queue.js";

import { createFetchParams } from "./type_flyweight.js";
import { throttled } from "./throttle.js";
import { queued } from "./queue.js";

interface JsonRequestQueuedInterface extends FetchParamsInterface {
	status: "queued";
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
	readonly requestState: JsonRequestState;
}

export class JsonEvent extends Event implements JsonEventInterface {
	#requestState: JsonRequestState;

	constructor(requestState: JsonRequestState, eventInitDict?: EventInit) {
		super("#json", eventInitDict);
		this.#requestState = requestState;
	}

	get requestState() {
		return this.#requestState;
	}
}

class JsonFetch implements Queueable {
	#dispatchParams;
	#fetchParams;

	constructor(
		dispatchParams: DispatchParams,
		fetchParams: FetchParamsInterface,
	) {
		this.#dispatchParams = dispatchParams;
		this.#fetchParams = fetchParams;
	}

	queued(): void {
		let { target } = this.#dispatchParams;

		let event = new JsonEvent(
			{ status: "queued", ...this.#fetchParams },
			{ bubbles: true },
		);
		target.dispatchEvent(event);
	}

	fetch(): Promise<void> | undefined {
		return fetchJson(this.#dispatchParams, this.#fetchParams);
	}
}

export function dispatchJsonEvent(dispatchParams: DispatchParams) {
	let fetchParams = createFetchParams(dispatchParams);
	if (!fetchParams) return;

	// Debounce from herer {
	if (throttled(dispatchParams, fetchParams)) return;

	// this is the part to debounce.

	let jsonFetch = new JsonFetch(dispatchParams, fetchParams);

	// if (debounced(dispatchParams, jsonFetch)) return;

	if (queued(dispatchParams, jsonFetch)) return;

	jsonFetch.fetch();
	// to here } !!!!
}

function debouncedPath(
	dispatchParams: DispatchParams,
	fetchParams: FetchParamsInterface,
) {
	let jsonFetch = new JsonFetch(dispatchParams, fetchParams);

	// if (debounced(dispatchParams, fetchParams)) return

	if (queued(dispatchParams, jsonFetch)) return;

	jsonFetch.fetch();
}

// just put this in the object above?
function fetchJson(
	dispatchParams: DispatchParams,
	fetchParams: FetchParamsInterface,
): Promise<void> | undefined {
	if (fetchParams.abortController.signal.aborted) return;

	let { target } = dispatchParams;

	let event = new JsonEvent(
		{ status: "requested", ...fetchParams },
		{ bubbles: true },
	);
	target.dispatchEvent(event);

	return fetch(fetchParams.request)
		.then(resolveResponseBody)
		.then(function ([response, json]) {
			let event = new JsonEvent(
				{ status: "resolved", response, json, ...fetchParams },
				{ bubbles: true },
			);
			target.dispatchEvent(event);
		})
		.catch(function (error: any) {
			let event = new JsonEvent(
				{ status: "rejected", error, ...fetchParams },
				{ bubbles: true },
			);
			target.dispatchEvent(event);
		});
}

function resolveResponseBody(
	response: Response,
): Promise<[Response, ReturnType<Response["json"]>]> {
	return Promise.all([response, response.json()]);
}
