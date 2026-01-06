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
	inbound: QueuableInterface[];
	outbound: QueuableInterface[];
}

// MODULE WIDE MEMORY
let queueMap = new WeakMap<EventTarget, Queue>();

class QueuedAtom implements QueuableInterface {
	#atom: QueableAtom;

	constructor(atom: QueableAtom) {
		this.#atom = atom;
	}

	async dispatch(queueTarget: EventTarget) {
		await this.#atom.fetch();
		queueNext(queueTarget);
	}
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
			inbound: [],
			outbound: [],
		};
		queueMap.set(queueTarget, freshQueue);
		queue = freshQueue;
	}

	atom.dispatchQueueEvent();

	let entry = new QueuedAtom(atom);
	queue.inbound.push(entry);
	queueNext(queueTarget);

	return true;
}

function getQueueParams(
	dispatchParams: DispatchParams,
): QueueParamsInterface | undefined {
	let { sourceEl, target, sourceEvent } = dispatchParams;

	let queueAttr = sourceEl.getAttribute(`${sourceEvent.type}:queue`);
	if (null === queueAttr) return;

	let queueTarget: EventTarget = document;
	if ("_target" === queueAttr) queueTarget = target;

	return { queueTarget };
}

function queueNext(el: EventTarget) {
	let queue = queueMap.get(el);
	if (!queue) return;

	if (!queue.outbound.length) {
		while (queue.inbound.length) {
			let pip = queue.inbound.pop();
			if (pip) queue.outbound.push(pip);
		}
	}

	queue.outbound.pop()?.dispatch(el);
}
