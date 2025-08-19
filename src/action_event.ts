import type { DispatchParams } from "./type_flyweight.js";

export interface ActionParamsInterface {
	sourceEvent: Event;
	action: string;
}

export interface ActionEventInterface {
	actionParams: ActionParamsInterface;
}

export class ActionEvent extends Event implements ActionEventInterface {
	actionParams: ActionParamsInterface;

	constructor(actionParams: ActionParamsInterface, eventInit?: EventInit) {
		super("#action", eventInit);
		this.actionParams = actionParams;
	}
}

export function dispatchActionEvent(dispatchParams: DispatchParams) {
	let actionParams = getActionParams(dispatchParams);
	if (!actionParams) return;

	let { el, composed } = dispatchParams;

	let event = new ActionEvent(actionParams, { bubbles: true, composed });
	el.dispatchEvent(event);
}

function getActionParams(
	dispatchParams: DispatchParams,
): ActionParamsInterface | undefined {
	let { el, sourceEvent } = dispatchParams;
	let { type } = sourceEvent;

	let action = el.getAttribute(`${type}:`);
	if ("#action" === action) {
		action = el.getAttribute(`${type}:action`);
	}

	if (action) return { action, sourceEvent };
}
