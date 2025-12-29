import type { DispatchParams } from "./type_flyweight.js";

export interface QueueParamsInterface {
	queueTarget: EventTarget;
}

export interface QueuableInterface {
	dispatch(): void;
}

export interface FetchCallback<A> {
	(fetchParams: A, dispatchParams: DispatchParams): Promise<void> | undefined;
}

interface Queue {
	incoming: QueuableInterface[];
	outgoing: QueuableInterface[];
}

let queueMap = new WeakMap<EventTarget, Queue>();

export interface QueableAtom {
	queueParams: QueueParamsInterface;
	dispatchQueuedEvent(): void;
	fetch(): Promise<void>;
}

export class QueuedAtom implements QueuableInterface {
	#params: QueableAtom;

	constructor(params: QueableAtom) {
		this.#params = params;
	}

	dispatch() {
		let { queueTarget } = this.#params.queueParams;

		this.#params.fetch().finally(function () {
			queueNext(queueTarget);
		});
	}
}

export function getQueueParams(
	dispatchParams: DispatchParams,
): QueueParamsInterface | undefined {
	let { el, target, sourceEvent } = dispatchParams;

	let queueTargetAttr = el.getAttribute(`${sourceEvent.type}:queue`);
	if (!queueTargetAttr) return;

	let queueTarget: EventTarget = document;
	if ("_target" === queueTargetAttr) queueTarget = target;

	return { queueTarget };
}

export function enqueue(atom: QueableAtom) {
	let { queueTarget } = atom.queueParams;
	let queue = queueMap.get(queueTarget);
	if (!queue) {
		let freshQueue = {
			incoming: [],
			outgoing: [],
		};
		queueMap.set(queueTarget, freshQueue);
		queue = freshQueue;
	}

	// let entry = new Queueable(params);
	// queue.incoming.push(entry);
	queueNext(queueTarget);
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
