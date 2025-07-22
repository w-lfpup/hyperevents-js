// not queue-able

// throttle by action on
// _document _currentTarget _target
// { _document: {action: timestamp} }

import { shouldThrottle } from "./throttle.js";

export interface ActionEventParamsInterface {
	sourceEvent: Event;
	action: string;
	target?: Element | null;
}

export interface ActionEventInterface {
	readonly actionParams: ActionEventParamsInterface;
}

export class ActionEvent extends Event implements ActionEventInterface {
	#params: ActionEventParamsInterface;

	constructor(params: ActionEventParamsInterface, eventInit?: EventInit) {
		super("#action", eventInit);
		this.#params = params;
	}

	get actionParams() {
		return this.#params;
	}
}

export function getActionEvent(sourceEvent: Event, el: Element, kind: string) {
	let action = el.getAttribute(`${kind}:`);
	if ("action" === action) {
		action = el.getAttribute(`${kind}:action`);
	}

	if (action) {
		if (shouldThrottle(sourceEvent, el, kind, action)) return;

		let event = new ActionEvent({ action, sourceEvent }, { bubbles: true });
		el.dispatchEvent(event);
	}
}
