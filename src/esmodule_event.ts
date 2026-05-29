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
	element: Element;
	event: Event;
}

let moduleMap = new Set<string>();

export class EsModuleEvent extends Event implements EsModuleEventInterface {
	requestState: EsModuleRequestState;

	constructor(requestState: EsModuleRequestState, eventInitDict: EventInit) {
		super("#esmodule", eventInitDict);
		this.requestState = requestState;
	}
}

class EsModuleImport implements Queueable {
	#dispatchParams;
	#importParams;

	constructor(dispatchParams: DispatchParams, importParams: EsImportParams) {
		this.#dispatchParams = dispatchParams;
		this.#importParams = importParams;
	}

	dispatchQueueEvent(): void {
		let { target, composed } = this.#dispatchParams;
		let moduleQueued: EsModuleQueuedInterface = {
			status: "queued",
			...this.#importParams,
		};

		let { url } = this.#importParams;
		moduleMap.add(url);

		let event = new EsModuleEvent(moduleQueued, { bubbles: true, composed });
		target.dispatchEvent(event);
	}

	fetch(): Promise<void> | undefined {
		return importEsModule(this.#dispatchParams, this.#importParams);
	}
}

export function dispatchEsModuleEvent(dispatchParams: DispatchParams) {
	let { element, event } = dispatchParams;

	let urlAttr = element.getAttribute(`${event.type}:url`);
	if (null === urlAttr) return;

	let url = new URL(urlAttr, location.href).toString();
	if (moduleMap.has(url)) return;

	let moduleImport = new EsModuleImport(dispatchParams, {
		url,
		element,
		event,
	});
	if (queued(dispatchParams, moduleImport)) return;

	moduleImport.fetch();
}

function importEsModule(
	dispatchParams: DispatchParams,
	esImportParams: EsImportParams,
): Promise<void> | undefined {
	let { url } = esImportParams;
	let requested: EsModuleRequestedInterface = { status: "requested", url };
	moduleMap.add(url);

	let { element, target, composed, event } = dispatchParams;
	let esmoduleEvent = new EsModuleEvent(requested, { bubbles: true, composed });
	target.dispatchEvent(esmoduleEvent);

	return import(url)
		.then(function () {
			let resolved: EsModuleResolvedInterface = { status: "resolved", url };
			let esmoduleEvent = new EsModuleEvent(resolved, {
				bubbles: true,
				composed,
			});
			target.dispatchEvent(esmoduleEvent);
		})
		.catch(function (error: any) {
			moduleMap.delete(url);

			let rejected: EsModuleErrorInterface = { status: "rejected", url, error };
			let esmoduleEvent = new EsModuleEvent(rejected, {
				bubbles: true,
				composed,
			});
			target.dispatchEvent(esmoduleEvent);
		});
}
