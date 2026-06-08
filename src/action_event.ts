declare global {
	interface GlobalEventHandlersEventMap {
		["#action"]: ActionEventInterface;
	}
	interface ElementEventMap {
		["action"]: ActionEventInterface;
	}
}

import type { DispatchParams } from "./type_flyweight.js";
import type { Queueable } from "./queue.js";

export interface ActionQueuedInterface {
	status: "queued";
	type: string;
	formData?: FormData;
	target: EventTarget;
	event: Event;
}

export interface ActionCompleteInterface {
	status: "complete";
	type: string;
	formData?: FormData;
	target: EventTarget;
	event: Event;
}

type ActionStatus = ActionQueuedInterface | ActionCompleteInterface;

export interface ActionEventInterface extends Event {
	action: ActionStatus;
}

export class ActionEvent extends Event implements ActionEventInterface {
	action: ActionStatus;

	constructor(actionStatus: ActionStatus, eventInit?: EventInit) {
		super("#action", eventInit);
		this.action = actionStatus;
	}
}

class ActionFetch implements Queueable {
	#formData: FormData | undefined = undefined;

	#dispatchParams;
	#actionType;

	constructor(dispatchParams: DispatchParams, actionType: string) {
		this.#dispatchParams = dispatchParams;
		this.#actionType = actionType;

		let { target } = this.#dispatchParams;
		if (target instanceof HTMLFormElement)
			this.#formData = new FormData(target);
	}

	queued(): void {
		let { dispatchTarget, event, target } = this.#dispatchParams;

		let actionEvent = new ActionEvent({
			status: "queued",
			type: this.#actionType,
			formData: this.#formData,
			target,
			event,
		});

		dispatchTarget.dispatchEvent(actionEvent);
	}

	fetch(): Promise<void> | undefined {
		if (this.#dispatchParams.abortController?.signal.aborted) return;

		let { dispatchTarget, event, target } = this.#dispatchParams;

		let actionEvent = new ActionEvent({
			status: "complete",
			type: this.#actionType,
			formData: this.#formData,
			target,
			event,
		});

		dispatchTarget.dispatchEvent(actionEvent);
		return;
	}
}

export function composeAction(
	dispatchParams: DispatchParams,
): ActionFetch | undefined {
	return new ActionFetch(dispatchParams, dispatchParams.type);
}
