import type { DispatchParams, RequestStatus } from "./type_flyweight.js";

let urlSet = new Set();

const eventInitDict: EventInit = { bubbles: true, composed: true };

// no union type needed

export interface EsModuleEventErrorStatusInterface {
	status: "rejected";
	url: string;
	error: any;
}

export interface EsModuleEventResultsInterface {
	status: "requested" | "resolved";
	url: string;
}

export type EsModuleRequestStatusInterface =
	| EsModuleEventResultsInterface
	| EsModuleEventErrorStatusInterface;

export interface EsModuleEventInterface {
	requestStatus: EsModuleRequestStatusInterface;
}

export class ESModuleEvent extends Event implements EsModuleEventInterface {
	requestStatus: EsModuleRequestStatusInterface;

	constructor(
		requestStatus: EsModuleRequestStatusInterface,
		eventInitDict: EventInit,
	) {
		super("#esmodule", eventInitDict);
		this.requestStatus = requestStatus;
	}
}

export function dispatchModuleImport(params: DispatchParams) {
	let { el, sourceEvent } = params;

	let urlAttr = el.getAttribute(`${sourceEvent.type}:url`);
	if (null === urlAttr) return;

	let url = new URL(urlAttr, location.href).toString();
	if (urlSet.has(url)) return;
	urlSet.add(url);

	dispatchEvent({ status: "requested", url });
	import(url)
		.then(function () {
			dispatchEvent({ status: "resolved", url });
		})
		.catch(function (error: any) {
			urlSet.delete(url);
			dispatchEvent({ status: "rejected", url, error });
		});
}

function dispatchEvent(status: EsModuleRequestStatusInterface) {
	let event = new ESModuleEvent(status, eventInitDict);
	document.dispatchEvent(event);
}
