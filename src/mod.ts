export { ActionEvent } from "./action_event.js";
export { EsModuleEvent } from "./esmodule_event.js";
export { JsonEvent } from "./json_event.js";
export { HtmlEvent } from "./html_event.js";

import { dispatch } from "./dispatch.js";

export interface HyperEventsParamsInterface {
	target: EventTarget;
	eventNames: string[];
	connected?: boolean;
}

export interface HyperEventsInterface {
	connect(): void;
	disconnect(): void;
}

export class HyperEvents {
	#params: HyperEventsParamsInterface;

	constructor(params: HyperEventsParamsInterface) {
		this.#params = params;
		if (this.#params.connected) this.connect();
	}

	connect() {
		let { target, eventNames } = this.#params;

		for (let name of eventNames) {
			target.addEventListener(name, dispatch);
		}
	}

	disconnect() {
		let { target, eventNames } = this.#params;

		for (let name of eventNames) {
			target.removeEventListener(name, dispatch);
		}
	}
}
