import type { DispatchParams } from "./type_flyweight.js";

import { composeAction } from "./action_event.js";
import { dispatchEsModuleEvent } from "./esmodule_event.js";
import { dispatchJsonEvent } from "./json_event.js";
import { dispatchHtmlEvent } from "./html_event.js";
import { throttled } from "./throttle.js";
import { debounced } from "./debounce.js";
import type { Queueable } from "./queue.js";
import { queued } from "./queue.js";

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

class Dispatcher {
	#params: DispatchParams;
	constructor(params: DispatchParams) {
		this.#params = params;
	}
	dispatch() {
		dispatchEvent(this.#params);
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
			let hyperEventType =
				target.getAttribute(`${type}:type`) ?? undefined;

			let { throttle, abortController } = throttled({
				target,
				dispatchTarget,
				event,
			});

			if (throttle) continue;

			let formData: FormData | undefined = undefined;
			if (target instanceof HTMLFormElement)
				formData = new FormData(target);

			let dispatchParams: DispatchParams = {
				type: hyperEventType,
				formData,
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

// this could just be an object, ergonomics might be better for debounce
function dispatchEvent(params: DispatchParams) {
	let { kind } = params;

	let queueable: Queueable | undefined = undefined;
	if ("_esmodule" === kind) return dispatchEsModuleEvent(params);
	if ("_json" === kind) return dispatchJsonEvent(params);
	if ("_html" === kind) return dispatchHtmlEvent(params);

	queueable = composeAction(params);
	if (!queueable) return;

	if (queued(params, queueable)) return;
	queueable.fetch();
}
