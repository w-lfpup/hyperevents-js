import type { DispatchParams } from "./type_flyweight.js";

export interface QueueParamsInterface {
	queueTarget: EventTarget;
}

export interface QueuableInterface {
	dispatch(): void;
}

export interface FetchCallback<A> {
	(
		dispatchParams: DispatchParams,
		abortController: AbortController,
		fetchParams: A,
	): Promise<void> | undefined;
}

interface Queue {
	status: "enqueued" | "completed";
	incoming: QueuableInterface[];
	outgoing: QueuableInterface[];
}

let queueMap = new WeakMap<EventTarget, Queue>();

interface QueuableParams<A> {
	dispatchParams: DispatchParams;
	queueParams: QueueParamsInterface;
	abortController: AbortController;
	fetchParams: A;
	fetchCallback: FetchCallback<A>;
}

export class Queueable<A> implements QueuableInterface {
	#params: QueuableParams<A>;

	constructor(params: QueuableParams<A>) {
		this.#params = params;
	}

	dispatch() {
		let {
			fetchParams,
			fetchCallback,
			dispatchParams,
			queueParams,
			abortController,
		} = this.#params;
		let { queueTarget } = queueParams;

		let promisedJson = fetchCallback(
			dispatchParams,
			abortController,
			fetchParams,
		)?.finally(function () {
			queueNext(queueTarget);
		});

		if (!promisedJson) {
			queueNext(queueTarget);
		}
	}
}

export function getQueueParams(
	dispatchParams: DispatchParams,
): QueueParamsInterface | undefined {
	let { el, currentTarget, sourceEvent } = dispatchParams;

	let queueTargetAttr = el.getAttribute(`${sourceEvent.type}:queue`);
	if (!queueTargetAttr) return;

	let queueTarget: EventTarget = currentTarget;

	if ("_target" === queueTargetAttr) queueTarget = el;
	if ("_document" === queueTargetAttr) queueTarget = document;

	return { queueTarget };
}

// can combine these
export function enqueue(
	params: QueueParamsInterface,
	queueEntry: QueuableInterface,
) {
	let { queueTarget } = params;
	// add function to queue
	let queue = queueMap.get(queueTarget);
	if ("enqueued" === queue?.status) {
		queue.incoming.push(queueEntry);
		return;
	}

	let freshQueue: Queue = {
		status: "enqueued",
		incoming: [],
		outgoing: [],
	};

	queueMap.set(queueTarget, freshQueue);
	queueEntry.dispatch();
}

function queueNext(el: EventTarget) {
	let queue = queueMap.get(el);
	if (!queue) return;

	if (!queue.outgoing.length) {
		while (queue.incoming.length) {
			let pip = queue.incoming.pop();
			if (pip) queue.outgoing.push(pip);
		}
	}

	queue.outgoing.pop()?.dispatch();
}
