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
	// difference between target and host?
	let { formData, kind, type, dispatchTarget, event, target } =
		dispatchParams;

	let actionType = type;
	if (undefined === actionType) actionType = kind;
	if ("_action" === actionType) return;

	// if debounced?

	// if debounced? it means push stuff off till later

	if (throttled(dispatchParams)) return;

	// or debounce after a throttle?
	// if (debounced(dispatchParams)) {}

	// feels like after a throttle
	// action should be a function
	//
	let actionEvent = new ActionEvent(
		{ type: actionType, formData, target, event },
		{ bubbles: true },
	);

	dispatchTarget.dispatchEvent(actionEvent);
}
