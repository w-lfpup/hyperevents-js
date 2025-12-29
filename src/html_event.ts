import type { DispatchParams, FetchParamsInterface } from "./type_flyweight.js";
import type { QueableAtom } from "./queue.js";

import { createFetchParams } from "./type_flyweight.js";
import { throttled } from "./throttle.js";
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

class HtmlFetch implements QueableAtom {
	#dispatchParams;
	#fetchParams;

	constructor(
		dispatchParams: DispatchParams,
		fetchParams: FetchParamsInterface,
	) {
		this.#dispatchParams = dispatchParams;
		this.#fetchParams = fetchParams;
	}

	dispatchQueueEvent(): void {
		let { target, composed } = this.#dispatchParams;

		let event = new HtmlEvent(
			{ status: "queued", ...this.#fetchParams },
			{ bubbles: true, composed },
		);
		target.dispatchEvent(event);
	}

	fetch(): Promise<void> | undefined {
		return fetchHtml(this.#dispatchParams, this.#fetchParams);
	}
}

export function dispatchHtmlEvent(dispatchParams: DispatchParams) {
	let fetchParams = createFetchParams(dispatchParams);
	if (!fetchParams) return;

	if (throttled(dispatchParams, fetchParams)) return;

	let htmlFetch = new HtmlFetch(dispatchParams, fetchParams);
	if (queued(dispatchParams, htmlFetch)) return;

	htmlFetch.fetch();
}

function fetchHtml(
	dispatchParams: DispatchParams,
	fetchParams: FetchParamsInterface,
): Promise<void> | undefined {
	if (fetchParams.abortController.signal.aborted) return;

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
