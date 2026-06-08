import type { DispatchParams } from "./type_flyweight.js";
import type { Queueable } from "./queue.js";

import { composeAction } from "./action_event.js";
import { composeEsModule } from "./esmodule_event.js";
import { composeJson } from "./json_event.js";
import { composeHtml } from "./html_event.js";
import { throttled } from "./throttle.js";
import { debounced } from "./debounce.js";
import { queued } from "./queue.js";
import { composeArrayBuffer } from "./arraybuffer_events.js";

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

interface KindAndType {
	kind: string;
	htype: string;
}

interface Callback {
	(params: DispatchParams): Queueable | undefined;
}

const hEventReactions = new Map<string, Callback>([
	["_esmodule", composeEsModule],
	["_json", composeJson],
	["_html", composeHtml],
	["_arraybuffer", composeArrayBuffer],
	["_action", composeAction],
]);

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

		let kindAndType = getKindAndType(event, target);
		if (kindAndType) {
			let { throttle, abortController } = throttled({
				target,
				dispatchTarget,
				event,
			});

			// find out if debounce update
			if (throttle) continue;

			let { kind, htype } = kindAndType;
			let dispatchParams: DispatchParams = {
				type: htype,
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

function getKindAndType(
	event: Event,
	target: Element,
): KindAndType | undefined {
	let { type: eventType } = event;

	let kind = target.getAttribute(`${eventType}:`);
	if (!kind) return;

	let htype = target.getAttribute(`${eventType}:type`);

	if (hEventReactions.has(kind) && htype) return { kind, htype };
	if ("_esmodule" === kind) return { kind, htype: htype || "_esmodule" };
	if (kind && !htype) return { kind: "_action", htype: kind };
}

// this could just be an object, ergonomics might be better for debounce
function dispatchEvent(params: DispatchParams) {
	let { kind } = params;

	let composer = hEventReactions.get(kind);
	if (!composer) return;

	let queueable = composer(params);
	if (!queueable) return;

	if (queued(params, queueable)) return;

	queueable.fetch();
}
