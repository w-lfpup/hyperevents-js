import type { DispatchParams } from "./type_flyweight.js";

import { getQueueParams } from "./queue.js";

import { getThrottleParams, setThrottler, shouldThrottle } from "./throttle.js";

export interface ActionEventParamsInterface {
	sourceEvent: Event;
	action: string;
	formData?: FormData;
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
	let actionParams = getActionParams(dispatchParams);
	if (actionParams) {
		let throttleParams = getThrottleParams(dispatchParams, "action");
		if (shouldThrottle(dispatchParams, actionParams, throttleParams)) return;

		let abortController: AbortController | undefined = undefined;
		if (throttleParams) abortController = new AbortController();

		setThrottler(dispatchParams, actionParams, throttleParams, abortController);

		let event = new ActionEvent(actionParams, { bubbles: true });
		dispatchParams.el.dispatchEvent(event);
	}
}

function getActionParams(
	dispatchParams: DispatchParams,
): ActionEventParamsInterface | undefined {
	let { el, sourceEvent, formData } = dispatchParams;
	let { type } = sourceEvent;

	let action = el.getAttribute(`${type}:`);
	if ("action" === action) {
		action = el.getAttribute(`${type}:action`);
	}

	if (action) return { action, sourceEvent, formData };
}
