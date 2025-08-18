import type { DispatchParams } from "./type_flyweight.js";

interface EsModuleEventRequestedInterface {
	status: "requested";
	url: string;
}

interface EsModuleEventResolvedInterface {
	status: "resolved";
	url: string;
}

interface EsModuleEventErrorStateInterface {
	status: "rejected";
	url: string;
	error: any;
}

export type EsModuleRequestState =
	| EsModuleEventRequestedInterface
	| EsModuleEventResolvedInterface
	| EsModuleEventErrorStateInterface;

export interface EsModuleEventInterface {
	requestState: EsModuleRequestState;
}

let urlSet = new Set();

export class ESModuleEvent extends Event implements EsModuleEventInterface {
	requestState: EsModuleRequestState;

	constructor(requestState: EsModuleRequestState, eventInitDict: EventInit) {
		super("#esmodule", eventInitDict);
		this.requestState = requestState;
	}
}

export function dispatchEsModuleEvent(params: DispatchParams) {
	let { el, composed } = params;

	let urlAttr = el.getAttribute(`${params.sourceEvent.type}:url`);
	if (null === urlAttr) return;

	let url = new URL(urlAttr, location.href).toString();
	if (urlSet.has(url)) return;

	urlSet.add(url);
	dispatchEvent({ status: "requested", url }, el, composed);

	import(url)
		.then(function () {
			dispatchEvent({ status: "resolved", url }, el, composed);
		})
		.catch(function (error: any) {
			urlSet.delete(url);
			dispatchEvent({ status: "rejected", url, error }, el, composed);
		});
}

function dispatchEvent(requestState: EsModuleRequestState, target: EventTarget, composed: boolean) {
	let event = new ESModuleEvent(requestState, { bubbles: true, composed });
	target.dispatchEvent(event);
}
