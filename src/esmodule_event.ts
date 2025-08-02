import type { DispatchParams, RequestStatus } from "./type_flyweight.js";

let urlSet = new Set();

const eventInitDict: EventInit = { bubbles: true, composed: true };

export class ESModuleEvent extends Event {
	url: string;
	status: RequestStatus;

	constructor(url: string, status: RequestStatus, eventInitDict: EventInit) {
		super("#esmodule", eventInitDict);
		this.url = url;
		this.status = status;
	}
}

export function dispatchModuleImport(params: DispatchParams) {
	let { el, sourceEvent } = params;

	let urlAttr = el.getAttribute(`${sourceEvent.type}:url`);
	if (null === urlAttr) return;

	let url = new URL(urlAttr, location.href).toString();
	if (urlSet.has(url)) return;
	urlSet.add(url);

	dispatchEvent(url, "requested");
	import(url)
		.then(function () {
			dispatchEvent(url, "resolved");
		})
		.catch(function () {
			urlSet.delete(url);
			dispatchEvent(url, "rejected");
		});
}

function dispatchEvent(url: string, status: RequestStatus) {
	let event = new ESModuleEvent(url, status, eventInitDict);
	document.dispatchEvent(event);
}
