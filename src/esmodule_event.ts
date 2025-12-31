import type { DispatchParams } from "./type_flyweight.js";

interface EsModuleRequestedInterface {
	status: "requested";
	url: string;
}

interface EsModuleResolvedInterface {
	status: "resolved";
	url: string;
}

interface EsModuleErrorInterface {
	status: "rejected";
	url: string;
	error: any;
}

export type EsModuleRequestState =
	| EsModuleRequestedInterface
	| EsModuleResolvedInterface
	| EsModuleErrorInterface;

export interface EsModuleEventInterface {
	requestState: EsModuleRequestState;
}

// map {url: RequestState }
let urlSet = new Set();

let moduleMap = new Map<string, EsModuleRequestState>();

export class EsModuleEvent extends Event implements EsModuleEventInterface {
	requestState: EsModuleRequestState;

	constructor(requestState: EsModuleRequestState, eventInitDict: EventInit) {
		super("#esmodule", eventInitDict);
		this.requestState = requestState;
	}
}

export function dispatchEsModuleEvent(dispatchParams: DispatchParams) {
	let { el, target, composed, sourceEvent } = dispatchParams;

	let urlAttr = el.getAttribute(`${sourceEvent.type}:url`);
	if (null === urlAttr) return;

	let url = new URL(urlAttr, location.href).toString();
	let moduleState = moduleMap.get(url);

	if (moduleState) {
		let { status } = moduleState;
		if ("resolved" === status) {
			el.setAttribute(`${sourceEvent.type}:`, "_esmodule_resolved");
		}
		return;
	}

	let requested: EsModuleRequestState = { status: "requested", url };

	moduleMap.set(url, requested);

	// create object

	let event = new EsModuleEvent(requested, { bubbles: true, composed });
	target.dispatchEvent(event);

	import(url)
		.then(function () {
			let resolved: EsModuleResolvedInterface = { status: "resolved", url };
			let event = new EsModuleEvent(resolved, { bubbles: true, composed });
			el.setAttribute(`${sourceEvent.type}:`, "_esmodule_resolved");
			moduleMap.set(url, resolved);

			target.dispatchEvent(event);
		})
		.catch(function (error: any) {
			urlSet.delete(url);
			let event = new EsModuleEvent(
				{ status: "rejected", url, error },
				{ bubbles: true, composed },
			);
			target.dispatchEvent(event);
		});
}

class EsModuleImport implements QueableAtom {
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

		let event = new EsModuleEvent(
			{ status: "queued", ...this.#fetchParams },
			{ bubbles: true, composed },
		);
		target.dispatchEvent(event);
	}

	fetch(): Promise<void> | undefined {
		return importEsModule(this.#dispatchParams, this.#fetchParams);
	}
}

export function createFetchParams(
	dispatchParams: DispatchParams,
): FetchParamsInterface | undefined {
	let requestParams = getImportParams(dispatchParams);
	if (!requestParams) return;

	let abortController = new AbortController();

	let { action } = requestParams;
	let request = createRequest(dispatchParams, requestParams, abortController);

	return {
		action,
		request,
		abortController,
	};
}

function getImportParams(
	dispatchParams: DispatchParams,
): RequestParams | undefined {
	let { el, sourceEvent } = dispatchParams;
	let { type } = sourceEvent;

	let url = el.getAttribute(`${type}:url`);
	if (!url) return;

	let timeoutMsAttr = el.getAttribute(`${type}:timeout-ms`);
	let timeoutMs = parseInt(timeoutMsAttr ?? "");

	return {
		timeoutMs: Number.isNaN(timeoutMs) ? undefined : timeoutMs,
		url,
	};
}

interface ImportParams {
	abortController: AbortController;
	url: string;
}

function importEsModule(
	dispatchParams: DispatchParams,
	fetchParams: ImportParams,
): Promise<void> | undefined {
	let { url, abortController } = fetchParams;
	if (abortController.signal.aborted) return;

	let { el, target, composed, sourceEvent } = dispatchParams;

	let event = new EsModuleEvent(
		{ status: "requested", url },
		{ bubbles: true, composed },
	);
	target.dispatchEvent(event);

	import(url)
		.then(function () {
			let event = new EsModuleEvent(
				{ status: "resolved", url },
				{ bubbles: true, composed },
			);
			el.setAttribute(`${sourceEvent.type}:`, "_esmodule_resolved");
			target.dispatchEvent(event);
		})
		.catch(function (error: any) {
			urlSet.delete(url);
			let event = new EsModuleEvent(
				{ status: "rejected", url, error },
				{ bubbles: true, composed },
			);
			target.dispatchEvent(event);
		});
}
