import type { DispatchParams } from "./type_flyweight.js";

export interface ActionInterface {
	sourceEvent: Event;
	action: string;
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

	let { el, composed } = dispatchParams;

	let event = new ActionEvent(actionParams, { bubbles: true, composed });
	el.dispatchEvent(event);
}

function getActionParams(
	dispatchParams: DispatchParams,
): ActionInterface | undefined {
	let { el, sourceEvent } = dispatchParams;
	let { type } = sourceEvent;

	let action = el.getAttribute(`${type}:`);
	if ("_action" === action) {
		action = el.getAttribute(`${type}:action`);
	}

	if (action) return { action, sourceEvent };
}
