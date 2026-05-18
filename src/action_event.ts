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
	element: Element;
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

	let { composed, formData, kind, element, event, target } = dispatchParams;

	let type = kind;
	if ("_action" === kind) {
		let attr = element.getAttribute(`${event.type}:type`);
		if (attr) type = attr;
	}

	let actionEvent = new ActionEvent(
		{ type, formData, element, event },
		{ bubbles: true, composed },
	);
	target.dispatchEvent(actionEvent);
}
