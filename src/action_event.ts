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

// makes sense to throttle and queue

export function dispatchActionEvent(dispatchParams: DispatchParams) {
	let actionParams = getActionParams(dispatchParams);
	if (!actionParams) return;

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

	if (action) return { action, sourceEvent };
}
