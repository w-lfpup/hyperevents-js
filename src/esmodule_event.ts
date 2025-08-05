import type { DispatchParams, RequestStatus } from "./type_flyweight.js";

let urlSet = new Set();

const eventInitDict: EventInit = { bubbles: true, composed: true };

export interface EsModuleEventResultsInterface {
	url: string;
	status: RequestStatus;
}

export interface EsModuleEventInterface {
	results: EsModuleEventResultsInterface;
}

export class ESModuleEvent extends Event implements EsModuleEventInterface {
	results: EsModuleEventResultsInterface;

	constructor(
		results: EsModuleEventResultsInterface,
		eventInitDict: EventInit,
	) {
		super("#esmodule", eventInitDict);
		this.results = results;
	}
}

export function dispatchModuleImport(params: DispatchParams) {
	let { el, sourceEvent } = params;

	let urlAttr = el.getAttribute(`${sourceEvent.type}:url`);
	if (null === urlAttr) return;

	let url = new URL(urlAttr, location.href).toString();
	if (urlSet.has(url)) return;
	urlSet.add(url);

	dispatchEvent({ url, status: "requested" });
	import(url)
		.then(function () {
			dispatchEvent({ url, status: "resolved" });
		})
		.catch(function () {
			urlSet.delete(url);
			dispatchEvent({ url, status: "rejected" });
		});
}

function dispatchEvent(results: EsModuleEventResultsInterface) {
	let event = new ESModuleEvent(results, eventInitDict);

	// only dispatch esmodule events from the document
	document.dispatchEvent(event);
}
