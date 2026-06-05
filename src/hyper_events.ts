import type { DispatchParams } from "./type_flyweight.js";

import { dispatchActionEvent } from "./action_event.js";
import { dispatchEsModuleEvent } from "./esmodule_event.js";
import { dispatchJsonEvent } from "./json_event.js";
import { dispatchHtmlEvent } from "./html_event.js";
import { throttled } from "./throttle.js";
import { debounced } from "./debounce.js";

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
		dispatch(event, this.#target);
	}
}

function dispatch(event: Event, dispatchTarget: EventTarget) {
	let { type } = event;

	for (let target of event.composedPath()) {
		if (!(target instanceof Element)) continue;

		if (target.hasAttribute(`${type}:prevent-default`))
			event.preventDefault();

		if (target.hasAttribute(`${type}:stop-immediate-propagation`)) return;

		let kind = target.getAttribute(`${type}:`);
		if (kind) {
			let actionType = target.getAttribute(`${type}:type`) ?? undefined;

			let { throttle, abortController } = throttled({
				target,
				dispatchTarget,
				event,
			});

			if (throttle) continue;

			let dispatchParams: DispatchParams = {
				type: actionType,
				target,
				dispatchTarget,
				kind,
				event,
				abortController,
			};

			// debounce
			if (!debounced(dispatchParams, dispatchEvent))
				dispatchEvent(dispatchParams);
		}

		if (target.hasAttribute(`${type}:stop-propagation`)) return;
	}
}

function dispatchEvent(params: DispatchParams) {
	let { kind } = params;

	if ("_esmodule" === kind) return dispatchEsModuleEvent(params);
	if ("_json" === kind) return dispatchJsonEvent(params);
	if ("_html" === kind) return dispatchHtmlEvent(params);

	return dispatchActionEvent(params);
}
