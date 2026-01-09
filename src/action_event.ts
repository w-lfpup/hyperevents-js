import type { DispatchParams } from "./type_flyweight.js";

import { throttled } from "./throttle.js";

export interface ActionInterface {
	kind: string;
	formData?: FormData;
	originElement: Element;
	originEvent: Event;
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

	let { composed, formData, kind, originElement, originEvent, target } =
		dispatchParams;

	let event = new ActionEvent(
		{ kind, formData, originElement, originEvent },
		{ bubbles: true, composed },
	);
	target.dispatchEvent(event);
}
