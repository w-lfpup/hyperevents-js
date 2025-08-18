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

export class EsModuleEvent extends Event implements EsModuleEventInterface {
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

	let event = new EsModuleEvent(
		{ status: "requested", url },
		{ bubbles: true, composed },
	);
	el.dispatchEvent(event);

	import(url)
		.then(function () {
			let event = new EsModuleEvent(
				{ status: "resolved", url },
				{ bubbles: true, composed },
			);
			el.dispatchEvent(event);
		})
		.catch(function (error: any) {
			urlSet.delete(url);
			let event = new EsModuleEvent(
				{ status: "rejected", url, error },
				{ bubbles: true, composed },
			);
			el.dispatchEvent(event);
		});
}
