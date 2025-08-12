import type { DispatchParams } from "./type_flyweight.js";
import type {
	QueueParamsInterface,
	Queuable,
	QueueNextCallback,
} from "./queue.js";

import { getQueueParams, enqueue } from "./queue.js";

import { getThrottleParams, setThrottler, shouldThrottle } from "./throttle.js";

export interface ActionEventParamsInterface {
	sourceEvent: Event;
	action: string;
	formData?: FormData;
}

// export interface ActionEventThrottledInterface extends ActionEventParamsInterface {
// 	status: "throttled";
// }

// export interface ActionEventQueuedInterface extends ActionEventParamsInterface {
// 	status: "queued";
// 	queueTarget: EventTarget;
// }

// export interface ActionEventDispatchedInterface extends ActionEventParamsInterface {
// 	status: "dispatched";
// }

// export type ActionEventState =
// 	| ActionEventDispatchedInterface
// 	| ActionEventQueuedInterface
// 	| ActionEventThrottledInterface;

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

// interface QueuableParams {
// 	actionParams: ActionEventParamsInterface;
// 	dispatchParams: DispatchParams;
// 	queueParams: QueueParamsInterface;
// 	abortController: AbortController;
// }

// // this could be smaller just as an old school function returns function
// class QueueableAction implements Queuable {
// 	#params: QueuableParams;

// 	constructor(params: QueuableParams) {
// 		this.#params = params;
// 	}

// 	dispatch(queueNextCallback: QueueNextCallback) {
// 		let {actionParams, dispatchParams, queueParams, abortController} = this.#params;
// 		let { queueTarget } = queueParams;

// 		if (!abortController?.signal.aborted) {
// 			let event = new ActionEvent({status: "dispatched", ...actionParams}, { bubbles: true });
// 			dispatchParams.el.dispatchEvent(event);
// 		}

// 		queueNextCallback(queueTarget);
// 	}
// }

export function dispatchActionEvent(dispatchParams: DispatchParams) {
	let actionParams = getActionParams(dispatchParams);
	if (!actionParams) return;

	// let throttleParams = getThrottleParams(dispatchParams, "action");
	// if (shouldThrottle(dispatchParams, actionParams, throttleParams)) return;

	// let abortController: AbortController | undefined = undefined;
	// if (throttleParams) abortController = new AbortController();

	// setThrottler(dispatchParams, actionParams, throttleParams, abortController);

	// let queueParams = getQueueParams(dispatchParams);
	// if (queueParams) {
	// 	if (!abortController) abortController = new AbortController();

	// 	let {queueTarget} = queueParams;
	// 	let {currentTarget} = dispatchParams;

	// 	currentTarget.dispatchEvent(new ActionEvent({status: "queued", queueTarget, ...actionParams}))

	// 	let entry = new QueueableAction({
	// 		actionParams,
	// 		dispatchParams,
	// 		queueParams,
	// 		abortController,
	// 	});
	// 	return enqueue(queueParams, entry);
	// }

	let event = new ActionEvent(actionParams, { bubbles: true });
	dispatchParams.el.dispatchEvent(event);
}

function getActionParams(
	dispatchParams: DispatchParams,
): ActionEventParamsInterface | undefined {
	let { el, sourceEvent, formData } = dispatchParams;
	let { type } = sourceEvent;

	let action = el.getAttribute(`${type}:`);
	if ("action" === action) {
		action = el.getAttribute(`${type}:action`);
	}

	if (action) return { action, sourceEvent, formData };
}
