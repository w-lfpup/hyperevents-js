import type { DispatchParams } from "./type_flyweight.js";

export interface QueueParamsInterface {
	queueTarget: Element;
}

export interface QueueNextCallback {
	(el: Element): void;
}

export interface Queuable {
	dispatch(cb: QueueNextCallback): void;
}

interface Queue {
	status: "enqueued" | "completed";
	incoming: Queuable[];
	outgoing: Queuable[];
}

let queueMap = new WeakMap<EventTarget, Queue>();

// can combine these
export function enqueue(params: QueueParamsInterface, queueEntry: Queuable) {
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

function queueNext(el: Element) {
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

		if (currentTarget instanceof Element && "_currentTarget" === queueTarget)
			return { queueTarget: currentTarget };
	}
}
