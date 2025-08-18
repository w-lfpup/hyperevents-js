export { ActionEvent } from "./action_event.js";
export { ESModuleEvent } from "./esmodule_event.js";
export { JsonEvent } from "./json_event.js";
export { HtmlEvent } from "./html_event.js";

import { dispatch } from "./dispatch.js";

export interface HyperActionsParamsInterface {
	target: EventTarget;
	connected: boolean | undefined;
	eventNames: string[];
}

export interface HyperActionsInterface {
	connect(): void;
	disconnect(): void;
}

export class HyperActions {
	#params: HyperActionsParamsInterface;

	constructor(params: HyperActionsParamsInterface) {
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
