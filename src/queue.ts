import type { DispatchParams } from "./type_flyweight.js";

export interface Queueable {
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
	#atom: Queueable;

	constructor(atom: Queueable) {
		this.#atom = atom;
	}

	async dispatch(queueTarget: EventTarget) {
		await this.#atom.fetch();
		queueNext(queueTarget);
	}
}

export function queued(
	dispatchParams: DispatchParams,
	atom: Queueable,
): boolean {
	console.log("queued:", dispatchParams);

	let queueParams = getQueueParams(dispatchParams);
	if (!queueParams) return false;

	let { queueTarget } = queueParams;
	let queue = queueMap.get(queueTarget);
	if (!queue) {
		queue = {
			inbound: [],
			outbound: [],
		};
		queueMap.set(queueTarget, queue);
	}

	atom.dispatchQueueEvent();

	queue.inbound.push(new QueuedAtom(atom));
	queueNext(queueTarget);

	return true;
}

function getQueueParams(
	dispatchParams: DispatchParams,
): QueueParamsInterface | undefined {
	let { originElement, target, originEvent } = dispatchParams;

	let queueAttr = originElement.getAttribute(`${originEvent.type}:queue`);
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
