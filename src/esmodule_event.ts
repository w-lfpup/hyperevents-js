declare global {
	interface GlobalEventHandlersEventMap {
		["#esmodule"]: EsModuleEventInterface;
	}
}

import type { DispatchParams } from "./type_flyweight.js";
import type { Queueable } from "./queue.js";

import { queued } from "./queue.js";

interface EsModuleQueuedInterface {
	status: "queued";
	url: string;
}

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
	| EsModuleQueuedInterface
	| EsModuleRequestedInterface
	| EsModuleResolvedInterface
	| EsModuleErrorInterface;

export interface EsModuleEventInterface {
	requestState: EsModuleRequestState;
}

interface EsImportParams {
	url: string;
	dispatchTarget: EventTarget;
	event: Event;
}

let moduleMap = new Set<string>();

export class EsModuleEvent extends Event implements EsModuleEventInterface {
	requestState: EsModuleRequestState;

	constructor(requestState: EsModuleRequestState, eventInitDict?: EventInit) {
		super("#esmodule", eventInitDict);
		this.requestState = requestState;
	}
}

class EsModuleImport implements Queueable {
	#importParams;

	constructor(importParams: EsImportParams) {
		this.#importParams = importParams;
	}

	queued(): void {
		let event = new EsModuleEvent({
			status: "queued",
			...this.#importParams,
		});

		document.dispatchEvent(event);
	}

	fetch(): Promise<void> | undefined {
		return importEsModule(this.#importParams);
	}
}

export function dispatchEsModuleEvent(dispatchParams: DispatchParams) {
	let { target, dispatchTarget, event } = dispatchParams;

	let urlAttr = target.getAttribute(`${event.type}:url`);
	if (null === urlAttr) return;

	let url = new URL(urlAttr, location.href).toString();

	if (moduleMap.has(url)) return;
	moduleMap.add(url);

	// debounce

	let moduleImport = new EsModuleImport({
		url,
		dispatchTarget,
		event,
	});

	if (queued(dispatchParams, moduleImport)) return;

	moduleImport.fetch();
}

function importEsModule(
	esImportParams: EsImportParams,
): Promise<void> | undefined {
	let { url } = esImportParams;

	let esmoduleEvent = new EsModuleEvent({ status: "requested", url });
	document.dispatchEvent(esmoduleEvent);

	return import(url)
		.then(function () {
			let esmoduleEvent = new EsModuleEvent({
				status: "resolved",
				url,
			});

			document.dispatchEvent(esmoduleEvent);
		})
		.catch(function (error: any) {
			moduleMap.delete(url);

			let esmoduleEvent = new EsModuleEvent({
				status: "rejected",
				url,
				error,
			});

			document.dispatchEvent(esmoduleEvent);
		});
}
