declare global {
	interface GlobalEventHandlersEventMap {
		["#action"]: ActionEventInterface;
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
	#dispatchParams;
	#actionType;

	constructor(dispatchParams: DispatchParams, actionType: string) {
		this.#dispatchParams = dispatchParams;
		this.#actionType = actionType;
	}

	queued(): void {
		let { dispatchTarget, event, target, formData } = this.#dispatchParams;

		let actionEvent = new ActionEvent({
			status: "queued",
			type: this.#actionType,
			target,
			event,
			formData,
		});

		dispatchTarget.dispatchEvent(actionEvent);
	}

	fetch(): Promise<void> | undefined {
		if (this.#dispatchParams.abortController?.signal.aborted) return;

		let { dispatchTarget, event, target, formData } = this.#dispatchParams;

		let actionEvent = new ActionEvent({
			status: "complete",
			type: this.#actionType,
			formData,
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
	let { kind, type } = dispatchParams;

	let actionType = type;
	if (undefined === actionType) actionType = kind;
	if ("_action" === actionType) return;

	return new ActionFetch(dispatchParams, actionType);
}
