import type { DispatchParams } from "./type_flyweight.js";

import { dispatchActionEvent } from "./action_event.js";
import { dispatchEsModuleEvent } from "./esmodule_event.js";
import { dispatchJsonEvent } from "./json_event.js";
import { dispatchHtmlEvent } from "./html_event.js";

export interface HyperEventsParamsInterface {
	connected?: boolean;
	eventNames: string[];
	host: EventTarget; // alwyas document
	target?: EventTarget; // could be a web component, template, shadow dom, fragment
}

export interface HyperEventsInterface {
	connect(): void;
	disconnect(): void;
}

// Order of operations
// |
// V
// Throttle
// Debounce
// Queue
// Fetch

// Map with type:action
//
// throttle / debounce
// not in map
// if debounce add dispatch
// if throttle throttle
// else debounce
// add to queue

// if queue
// add to queue

// then fetch

// We need a map for throttle
// should we throttle? no?
//
// We

class HyperEvent {
	queue() {}

	fetch() {
		//
	}
}

export class HyperEvents {
	#params: HyperEventsParamsInterface;
	#target: EventTarget;

	constructor(params: HyperEventsParamsInterface) {
		this.#params = params;
		this.#target = params.target ?? params.host;

		if (this.#params.connected) this.connect();
	}

	connect() {
		let { host, eventNames } = this.#params;

		for (let name of eventNames) {
			host.addEventListener(name, this.#dispatch);
		}
	}

	disconnect() {
		let { host, eventNames } = this.#params;

		for (let name of eventNames) {
			host.removeEventListener(name, this.#dispatch);
		}
	}

	#dispatch = this.#unboundDispatch.bind(this);
	#unboundDispatch(event: Event) {
		let { type, currentTarget, target } = event;
		if (!currentTarget) return;

		for (let node of event.composedPath()) {
			if (node instanceof Element) {
				if (node.hasAttribute(`${type}:prevent-default`))
					event.preventDefault();

				if (node.hasAttribute(`${type}:stop-immediate-propagation`))
					return;

				let kind = node.getAttribute(`${type}:`);
				if (kind) {
					let formData: FormData | undefined;
					if (target instanceof HTMLFormElement)
						formData = new FormData(target);

					let actionType =
						node.getAttribute(`${type}:type`) ?? undefined;

					dispatchEvent({
						target: node, // target
						dispatchTarget: this.#target, // dispatchTarget
						type: actionType,
						formData,
						kind,
						event,
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
