import type { DispatchParams } from "./type_flyweight.js";

export interface Queueable {
	dispatchQueueEvent(): void;
	fetch(): Promise<void> | undefined;
}

interface QueueParamsInterface {
	queueTarget: EventTarget;
}

class Queue {
	#inUse: boolean = false;
	#inbound: Queueable[] = [];
	#outbound: Queueable[] = [];

	enqueue(atom: Queueable) {
		this.#inbound.push(atom);
		if (!this.#inUse) this.#queueAtom();
	}

	async #queueAtom() {
		if (!this.#outbound.length) {
			while (this.#inbound.length) {
				let pip = this.#inbound.pop();
				if (pip) this.#outbound.push(pip);
			}
		}

		let pip = this.#outbound.pop();
		if (pip) {
			this.#inUse = true;

			await pip.fetch();
			this.#queueAtom();
		} else {
			this.#inUse = false;
		}
	}
}

// MODULE WIDE MEMORY
let queueMap = new WeakMap<EventTarget, Queue>();

export function queued(
	dispatchParams: DispatchParams,
	atom: Queueable,
): boolean {
	let queueParams = getQueueParams(dispatchParams);
	if (!queueParams) return false;

	let { queueTarget } = queueParams;
	let queue = queueMap.get(queueTarget);
	if (!queue) {
		queue = new Queue();
		queueMap.set(queueTarget, queue);
	}

	atom.dispatchQueueEvent();
	queue.enqueue(atom);

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
