import type { DispatchParams } from "./type_flyweight.js";

export interface QueueParamsInterface {
	queueTarget: EventTarget;
}

export interface QueueNextCallback {
	(el: EventTarget): void;
}

export interface QueuableInterface {
	dispatch(cb: QueueNextCallback): void;
}

interface Queue {
	status: "enqueued" | "completed";
	incoming: QueuableInterface[];
	outgoing: QueuableInterface[];
}

let queueMap = new WeakMap<EventTarget, Queue>();

interface QueuableParams<A> {
	fetchParams: A;
	fetchCallback: Function;
	dispatchParams: DispatchParams;
	queueParams: QueueParamsInterface;
	abortController: AbortController;
}

class Queueable<A> implements QueuableInterface {
	#params: QueuableParams<A>;

	constructor(params: QueuableParams<A>) {
		this.#params = params;
	}

	dispatch(queueNextCallback: QueueNextCallback) {
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
			queueNextCallback(queueTarget);
		});

		if (!promisedJson) {
			queueNextCallback(queueTarget);
		}
	}
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
	queueEntry.dispatch(queueNext);
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

	queue.outgoing.pop()?.dispatch(queueNext);
}

export function getQueueParams(
	dispatchParams: DispatchParams,
): QueueParamsInterface | undefined {
	let { el, currentTarget, sourceEvent } = dispatchParams;

	let queueTarget = el.getAttribute(`${sourceEvent.type}:queue`);
	if (queueTarget) {
		// throttle by element
		if ("_target" === queueTarget) return { queueTarget: el };

		if ("_document" === queueTarget) return { queueTarget: document };

		if (currentTarget instanceof Element && "_currentTarget" === queueTarget)
			return { queueTarget: currentTarget };
	}
}
