import type { DispatchParams, RequestStatus } from "./type_flyweight.js";

let set = new Set();

const eventInitDict: EventInit = { bubbles: true, composed: true };

class ESModuleEvent extends Event {
	#url: string;
	#status: RequestStatus;

	constructor(url: string, status: RequestStatus, eventInitDict: EventInit) {
		super("#esmodule", eventInitDict);
		this.#url = url;
		this.#status = status;
	}

	get urlStr(): string {
		return this.#url;
	}

	get status(): RequestStatus {
		return this.#status;
	}
}

export function dispatchModuleImport(params: DispatchParams) {
	let { el, sourceEvent } = params;

	let urlAttr = el.getAttribute(`${sourceEvent.type}:url`);
	if (null === urlAttr) return;

	let url = new URL(urlAttr, location.href).toString();
	if (set.has(url)) return;

	set.add(url);

	// need a memory address for weak maps
	let event = new ESModuleEvent(url, "requested", eventInitDict);
	document.dispatchEvent(event);

	import(url)
		.then(function () {
			let event = new ESModuleEvent(url, "resolved", eventInitDict);
			document.dispatchEvent(event);
		})
		.catch(function () {
			set.delete(url);

			let event = new ESModuleEvent(url, "rejected", eventInitDict);
			document.dispatchEvent(event);
		});
}
