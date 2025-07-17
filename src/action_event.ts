export interface ActionEventParamsInterface {
	action: string;
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

export function getActionEvent(el: Element, kind: string) {
	let action = el.getAttribute(`${kind}:action`);
	if (action) return new ActionEvent({ action }, { bubbles: true });
}

export function getFallbackAction(el: Element, action: string | null) {
	if (action) return new ActionEvent({ action }, { bubbles: true });
}
