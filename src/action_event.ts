declare global {
	interface GlobalEventHandlersEventMap {
		["#action"]: ActionEventInterface;
	}
}

import type { DispatchParams } from "./type_flyweight.js";

import { throttled } from "./throttle.js";

export interface ActionInterface {
	type: string;
	formData?: FormData;
	target: EventTarget;
	event: Event;
}

export interface ActionEventInterface extends Event {
	action: ActionInterface;
}

export class ActionEvent extends Event implements ActionEventInterface {
	action: ActionInterface;

	constructor(dispatchParams: ActionInterface, eventInit?: EventInit) {
		super("#action", eventInit);
		this.action = dispatchParams;
	}
}

export function dispatchActionEvent(dispatchParams: DispatchParams) {
	let { kind, type, dispatchTarget, event, target } = dispatchParams;

	let actionType = type;
	if (undefined === actionType) actionType = kind;
	if ("_action" === actionType) return;

	if (throttled(dispatchParams)) return;

	let formData: FormData | undefined;
	if (target instanceof HTMLFormElement) formData = new FormData(target);

	let actionEvent = new ActionEvent(
		{ type: actionType, formData, target, event },
		{ bubbles: true },
	);

	dispatchTarget.dispatchEvent(actionEvent);
}
