// import { dispatch } from "./dispatch.js";
import type { DispatchParams } from "./type_flyweight.js";
import { dispatchActionEvent } from "./action_event.js";
import { dispatchEsModuleEvent } from "./esmodule_event.js";
import { dispatchJsonEvent } from "./json_event.js";
import { dispatchHtmlEvent } from "./html_event.js";

export interface HyperEventsParamsInterface {
	connected?: boolean;
	eventNames: string[];
	host: EventTarget;
	target?: EventTarget;
}

export interface HyperEventsInterface {
	connect(): void;
	disconnect(): void;
}

export class HyperEvents {
	#params: HyperEventsParamsInterface;
	#boundDispatch = this.#dispatch.bind(this);
	#target: EventTarget;

	constructor(params: HyperEventsParamsInterface) {
		this.#params = params;
		this.#target = params.target ?? params.host;

		if (this.#params.connected) this.connect();
	}

	connect() {
		let { host, eventNames } = this.#params;

		for (let name of eventNames) {
			host.addEventListener(name, this.#boundDispatch);
		}
	}

	disconnect() {
		let { host, eventNames } = this.#params;

		for (let name of eventNames) {
			host.removeEventListener(name, this.#boundDispatch);
		}
	}

	#dispatch(sourceEvent: Event) {
		let { type, currentTarget, target } = sourceEvent;
		if (!currentTarget) return;

		let formData: FormData | undefined;
		if (target instanceof HTMLFormElement) formData = new FormData(target);

		for (let node of sourceEvent.composedPath()) {
			if (node instanceof Element) {
				if (node.hasAttribute(`${type}:prevent-default`))
					sourceEvent.preventDefault();

				if (node.hasAttribute(`${type}:stop-immediate-propagation`)) return;

				let kind = node.getAttribute(`${type}:`);
				if (kind) {
					dispatchEvent({
						el: node,
						composed: node.hasAttribute(`${type}:composed`),
						kind,
						target: this.#target,
						sourceEvent,
						formData,
					});
				}

				if (node.hasAttribute(`${type}:stop-propagation`)) return;
			}
		}
	}
}

function dispatchEvent(params: DispatchParams) {
	let { kind } = params;

	if ("_esmodule" === kind) return dispatchEsModuleEvent(params);
	if ("_json" === kind) return dispatchJsonEvent(params);
	if ("_html" === kind) return dispatchHtmlEvent(params);

	return dispatchActionEvent(params);
}
