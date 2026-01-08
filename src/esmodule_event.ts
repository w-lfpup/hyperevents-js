import type { DispatchParams } from "./type_flyweight.js";
import type { Queueable } from "./queue.js";

import { removeActionAttr } from "./type_flyweight.js";
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
}

let moduleMap = new Map<string, EsModuleRequestState>();

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
		moduleMap.set(url, moduleQueued);

		let event = new EsModuleEvent(moduleQueued, { bubbles: true, composed });
		target.dispatchEvent(event);
	}

	fetch(): Promise<void> | undefined {
		return importEsModule(this.#dispatchParams, this.#importParams);
	}
}

export function dispatchEsModuleEvent(dispatchParams: DispatchParams) {
	let { originElement, originEvent } = dispatchParams;

	let urlAttr = originElement.getAttribute(`${originEvent.type}:url`);
	if (null === urlAttr) return;

	let url = new URL(urlAttr, location.href).toString();
	let moduleState = moduleMap.get(url);
	if (moduleState) {
		let { status } = moduleState;
		if ("resolved" === status) removeActionAttr(originElement, originEvent);
		if ("rejected" !== status) return;
	}

	let moduleImport = new EsModuleImport(dispatchParams, { url });
	if (queued(dispatchParams, moduleImport)) return;

	moduleImport.fetch();
}

function importEsModule(
	dispatchParams: DispatchParams,
	esImportParams: EsImportParams,
): Promise<void> | undefined {
	let { url } = esImportParams;
	let requested: EsModuleRequestedInterface = { status: "requested", url };
	moduleMap.set(url, requested);

	let { originElement, target, composed, originEvent } = dispatchParams;
	let event = new EsModuleEvent(requested, { bubbles: true, composed });
	target.dispatchEvent(event);

	return import(url)
		.then(function () {
			let resolved: EsModuleResolvedInterface = { status: "resolved", url };
			moduleMap.set(url, resolved);

			let event = new EsModuleEvent(resolved, { bubbles: true, composed });
			target.dispatchEvent(event);

			removeActionAttr(originElement, originEvent);
		})
		.catch(function (error: any) {
			let rejected: EsModuleErrorInterface = { status: "rejected", url, error };
			moduleMap.set(url, rejected);

			let event = new EsModuleEvent(rejected, { bubbles: true, composed });
			target.dispatchEvent(event);
		});
}
