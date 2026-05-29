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
	if (throttled(dispatchParams)) return;

	let { composed, formData, kind, type, element, event, target } =
		dispatchParams;

	// if debounced?

	let actionType = type;
	if (undefined === actionType) actionType = kind;
	if ("_action" === actionType) return;

	let actionEvent = new ActionEvent(
		{ type: actionType, formData, target, event },
		{ bubbles: true, composed },
	);

	target.dispatchEvent(actionEvent);
}
