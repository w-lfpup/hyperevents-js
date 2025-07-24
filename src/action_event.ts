import type { DispatchParams } from "./type_flyweight.js";

import { shouldThrottle, setThrottler, getThrottleParams } from "./throttle.js";

export interface ActionEventParamsInterface {
	sourceEvent: Event;
	action: string;
	// target?: Element | null;
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

export function getActionEvent(dispatchParams: DispatchParams) {
	let { el, currentTarget, sourceEvent } = dispatchParams;
	let { type } = sourceEvent;

	let action = el.getAttribute(`${type}:`);
	if ("action" === action) {
		action = el.getAttribute(`${type}:action`);
	}

	if (action) {
		let throttleParams = getThrottleParams(dispatchParams, "action", action);
		if (shouldThrottle(dispatchParams, throttleParams)) return;
		setThrottler(dispatchParams, throttleParams);

		let event = new ActionEvent({ action, sourceEvent }, { bubbles: true });
		el.dispatchEvent(event);
	}
}
