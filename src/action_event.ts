import type { DispatchParams } from "./type_flyweight.js";

import { throttled } from "./throttle.js";

export interface ActionInterface {
	action: string;
	originElement: Element;
	originEvent: Event;
}

export interface ActionEventInterface extends Event {
	dispatchParams: ActionInterface;
}

export class ActionEvent extends Event implements ActionEventInterface {
	dispatchParams: ActionInterface;

	constructor(dispatchParams: ActionInterface, eventInit?: EventInit) {
		super("#action", eventInit);
		this.dispatchParams = dispatchParams;
	}
}

export function dispatchActionEvent(dispatchParams: DispatchParams) {
	if (throttled(dispatchParams)) return;

	let { target, composed, kind, originElement, originEvent } = dispatchParams;

	let event = new ActionEvent(
		{ action: kind, originElement, originEvent },
		{ bubbles: true, composed },
	);
	target.dispatchEvent(event);
}
