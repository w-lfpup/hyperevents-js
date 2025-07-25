import type { DispatchParams } from "./type_flyweight.js";

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

export interface ShouldQueueParams {
	prefix: string;
	action?: ReturnType<Element["getAttribute"]>;
	url?: ReturnType<Element["getAttribute"]>;
}

let queueMap = new WeakMap<Element, Queue>();

export function enqueue(el: Element, queueEntry: Queuable) {
	// add function to queue
	let queue = queueMap.get(el);
	if ("enqueued" === queue?.status) {
		queue.incoming.push(queueEntry);
		return;
	}

	let freshQueue: Queue = {
		status: "enqueued",
		incoming: [],
		outgoing: [],
	};

	queueMap.set(el, freshQueue);
	queueEntry.dispatch(queueNext);
}

function queueNext(el: Element) {
	let queue = queueMap.get(el);
	if (queue) {
		if (!queue.outgoing.length) {
			while (queue.incoming.length) {
				let entry = queue.incoming.pop();
				if (entry) queue.outgoing.push(entry);
			}
		}

		let entry = queue.outgoing.pop();
		if (entry) entry.dispatch(queueNext);
	}
}

export function shouldQueue(
	dispatchParams: DispatchParams,
	params: ShouldQueueParams,
): string | undefined {
	let { el, sourceEvent } = dispatchParams;

	let queueTarget = el.getAttribute(`${sourceEvent.type}:queue`);
	if (queueTarget) {
		// throttle by element
		if ("target" === queueTarget) return queueTarget;

		if ("currentTarget" === queueTarget) return queueTarget;
	}
}
