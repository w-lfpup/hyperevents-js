declare global {
	interface GlobalEventHandlersEventMap {
		["#html"]: HtmlEventInterface;
	}
}

import type { DispatchParams, FetchParamsInterface } from "./type_flyweight.js";
import type { Queueable } from "./queue.js";

import { createFetchParams } from "./type_flyweight.js";
import { queued } from "./queue.js";

interface HtmlRequestQueuedInterface extends FetchParamsInterface {
	status: "queued";
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
	readonly requestState: HtmlRequestState;
}

export class HtmlEvent extends Event implements HtmlEventInterface {
	#requestState: HtmlRequestState;

	constructor(requestState: HtmlRequestState, eventInit?: EventInit) {
		super("#html", eventInit);
		this.#requestState = requestState;
	}

	get requestState(): HtmlRequestState {
		return this.#requestState;
	}
}

class HtmlFetch implements Queueable {
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
		let { dispatchTarget } = this.#dispatchParams;

		let event = new HtmlEvent(
			{ status: "queued", ...this.#fetchParams },
			{ bubbles: true },
		);
		dispatchTarget.dispatchEvent(event);
	}

	fetch(): Promise<void> | undefined {
		return fetchHtml(this.#dispatchParams, this.#fetchParams);
	}
}

export function dispatchHtmlEvent(dispatchParams: DispatchParams) {
	let fetchParams = createFetchParams(dispatchParams);
	if (!fetchParams) return;

	let htmlFetch = new HtmlFetch(dispatchParams, fetchParams);
	if (queued(dispatchParams, htmlFetch)) return;

	htmlFetch.fetch();
}

function fetchHtml(
	dispatchParams: DispatchParams,
	fetchParams: FetchParamsInterface,
): Promise<void> | undefined {
	if (dispatchParams.abortController?.signal.aborted) return;

	let { dispatchTarget } = dispatchParams;

	let event = new HtmlEvent(
		{ status: "requested", ...fetchParams },
		{ bubbles: true },
	);
	dispatchTarget.dispatchEvent(event);

	return fetch(fetchParams.request)
		.then(resolveResponseBody)
		.then(function ([response, html]) {
			let event = new HtmlEvent(
				{ status: "resolved", response, html, ...fetchParams },
				{ bubbles: true },
			);
			dispatchTarget.dispatchEvent(event);
		})
		.catch(function (error: any) {
			let event = new HtmlEvent(
				{ status: "rejected", error, ...fetchParams },
				{ bubbles: true },
			);
			dispatchTarget.dispatchEvent(event);
		});
}

function resolveResponseBody(response: Response): Promise<[Response, string]> {
	return Promise.all([response, response.text()]);
}
