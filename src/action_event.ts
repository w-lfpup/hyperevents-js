import type { DispatchParams } from "./type_flyweight.js";

import { getThrottleParams, setThrottler } from "./throttle.js";

export interface ActionEventParamsInterface {
	sourceEvent: Event;
	action: string;
}

export interface ActionEventInterface {
	readonly actionParams: ActionEventParamsInterface;
}

export class ActionEvent extends Event implements ActionEventInterface {
	#params: ActionEventParamsInterface;

	constructor(params: ActionEventParamsInterface, eventInit?: EventInit) {
		super("#action", eventInit);
		this.#params = params;
	}

	get actionParams() {
		return this.#params;
	}
}

export function dispatchActionEvent(dispatchParams: DispatchParams) {
	let { el, sourceEvent } = dispatchParams;
	let { type } = sourceEvent;

	let action = el.getAttribute(`${type}:`);
	if ("action" === action) {
		action = el.getAttribute(`${type}:action`);
	}

	let reqParams = { action };

	if (action) {
		let throttleParams = getThrottleParams(dispatchParams, reqParams, "action");
		if (throttleParams) setThrottler(dispatchParams, reqParams, throttleParams);

		let event = new ActionEvent({ action, sourceEvent }, { bubbles: true });
		el.dispatchEvent(event);
	}
}
