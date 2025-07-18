export interface ActionEventParamsInterface {
	action: string;
	sourceEvent: Event;
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
	let action = el.getAttribute(`${kind}:action`);
	if (action) {
		let event = new ActionEvent({ action, sourceEvent }, { bubbles: true });
		el.dispatchEvent(event);
	}
}

export function getFallbackAction(
	sourceEvent: Event,
	el: Element,
	action: string | null,
) {
	if (action) {
		let event = new ActionEvent({ action, sourceEvent }, { bubbles: true });
		el.dispatchEvent(event);
	}
}
