import type { DispatchParams } from "./type_flyweight.js";

export interface ActionEventParamsInterface {
	sourceEvent: Event;
	action: string;
}

export interface ActionEventInterface {
	readonly actionParams: ActionEventParamsInterface;
}

export class ActionEvent extends Event implements ActionEventInterface {
	actionParams: ActionEventParamsInterface;

	constructor(actionParams: ActionEventParamsInterface, eventInit?: EventInit) {
		super("#action", eventInit);
		this.actionParams = actionParams;
	}
}

export function dispatchActionEvent(dispatchParams: DispatchParams) {
	let actionParams = getActionParams(dispatchParams);
	if (!actionParams) return;

	let { composed } = dispatchParams;

	let event = new ActionEvent(actionParams, { bubbles: true, composed });
	dispatchParams.el.dispatchEvent(event);
}

function getActionParams(
	dispatchParams: DispatchParams,
): ActionEventParamsInterface | undefined {
	let { el, sourceEvent } = dispatchParams;
	let { type } = sourceEvent;

	let action = el.getAttribute(`${type}:`);
	if ("action" === action) {
		action = el.getAttribute(`${type}:action`);
	}

	if (action) return { action, sourceEvent };
}
