import type { DispatchParams } from "./type_flyweight.js";

import { throttled } from "./throttle.js";

export interface ActionInterface {
	action: string;
	sourceEvent: Event;
}

export interface ActionEventInterface {
	actionParams: ActionInterface;
}

export class ActionEvent extends Event implements ActionEventInterface {
	actionParams: ActionInterface;

	constructor(actionParams: ActionInterface, eventInit?: EventInit) {
		super("#action", eventInit);
		this.actionParams = actionParams;
	}
}

export function dispatchActionEvent(dispatchParams: DispatchParams) {
	let actionParams = getActionParams(dispatchParams);
	if (!actionParams) return;

	if (throttled(dispatchParams)) return;

	let { target, composed } = dispatchParams;

	let event = new ActionEvent(actionParams, { bubbles: true, composed });
	target.dispatchEvent(event);
}

function getActionParams(
	dispatchParams: DispatchParams,
): ActionInterface | undefined {
	let { el, kind, sourceEvent } = dispatchParams;
	let { type } = sourceEvent;

	let action = "_action" === kind ? el.getAttribute(`${type}:action`) : kind;

	if (action !== null) return { action, sourceEvent };
}
