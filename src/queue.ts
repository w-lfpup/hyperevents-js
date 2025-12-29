import type { DispatchParams } from "./type_flyweight.js";

export interface QueableAtom {
	dispatchQueueEvent(): void;
	fetch(): Promise<void> | undefined;
}

interface QueueParamsInterface {
	queueTarget: EventTarget;
}

interface QueuableInterface {
	dispatch(queueTarget: EventTarget): void;
}

interface Queue {
	incoming: QueuableInterface[];
	outgoing: QueuableInterface[];
}

// MODULE WIDE MEMORY
//
// MAYBE ATTACH TO WINDOW?
let queueMap = new WeakMap<EventTarget, Queue>();

class QueuedAtom implements QueuableInterface {
	#atom: QueableAtom;

	constructor(atom: QueableAtom) {
		this.#atom = atom;
	}

	dispatch(queueTarget: EventTarget) {
		let promise = this.#atom.fetch();

		promise
			? promise.finally(function () {
					queueNext(queueTarget);
				})
			: queueNext(queueTarget);
	}
}

function getQueueParams(
	dispatchParams: DispatchParams,
): QueueParamsInterface | undefined {
	let { el, target, sourceEvent } = dispatchParams;

	let queueTargetAttr = el.getAttribute(`${sourceEvent.type}:queue`);
	if (!queueTargetAttr) return;

	let queueTarget: EventTarget = document;
	if ("_target" === queueTargetAttr) queueTarget = target;

	return { queueTarget };
}

export function queued(
	dispatchParams: DispatchParams,
	atom: QueableAtom,
): boolean {
	let queueParams = getQueueParams(dispatchParams);
	if (!queueParams) return false;

	let { queueTarget } = queueParams;
	let queue = queueMap.get(queueTarget);
	if (!queue) {
		let freshQueue: Queue = {
			incoming: [],
			outgoing: [],
		};
		queueMap.set(queueTarget, freshQueue);
		queue = freshQueue;
	}

	atom.dispatchQueueEvent();

	let entry = new QueuedAtom(atom);
	queue.incoming.push(entry);
	queueNext(queueTarget);

	return true;
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

	queue.outgoing.pop()?.dispatch(el);
}
