import type { DispatchParams, RequestStatus } from "./type_flyweight.js";

let urlSet = new Set();

const eventInitDict: EventInit = { bubbles: true, composed: true };

interface EsModuleEventErrorStateInterface {
	status: "rejected";
	url: string;
	error: any;
}

interface EsModuleEventRequestedInterface {
	status: "requested";
	url: string;
}

interface EsModuleEventResolvedInterface {
	status: "resolved";
	url: string;
}

export type EsModuleRequestState =
	| EsModuleEventRequestedInterface
	| EsModuleEventResolvedInterface
	| EsModuleEventErrorStateInterface;

export interface EsModuleEventInterface {
	requestState: EsModuleRequestState;
}

export class ESModuleEvent extends Event implements EsModuleEventInterface {
	requestState: EsModuleRequestState;

	constructor(
		requestState: EsModuleRequestState,
		eventInitDict: EventInit,
	) {
		super("#esmodule", eventInitDict);
		this.requestState = requestState;
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

function dispatchEvent(status: EsModuleRequestState) {
	let event = new ESModuleEvent(status, eventInitDict);
	document.dispatchEvent(event);
}
