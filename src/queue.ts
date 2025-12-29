import type { DispatchParams } from "./type_flyweight.js";

export interface QueableAtom {
	dispatchQueuedEvent(): void;
	fetch(): Promise<void>;
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

// module wide
let queueMap = new WeakMap<EventTarget, Queue>();

class QueuedAtom implements QueuableInterface {
	#params: QueableAtom;

	constructor(params: QueableAtom) {
		this.#params = params;
	}

	dispatch(queueTarget: EventTarget) {
		this.#params.fetch().finally(function () {
			queueNext(queueTarget);
		});
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
		let freshQueue = {
			incoming: [],
			outgoing: [],
		};
		queueMap.set(queueTarget, freshQueue);
		queue = freshQueue;
	}

	atom.dispatchQueuedEvent();

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
