import type { DispatchParams } from "./type_flyweight.js";

// queue should just be document wide
// all doucment all queue

export interface Queueable {
	dispatchQueueEvent(): void;
	fetch(): Promise<void> | undefined;
}

interface QueueParamsInterface {
	queueTarget: EventTarget;
}

class Queue {
	#inRoute: Queueable | undefined;
	#inbound: Queueable[] = [];
	#outbound: Queueable[] = [];

	enqueue(atom: Queueable) {
		this.#inbound.push(atom);
		atom.dispatchQueueEvent();

		if (!this.#inRoute) this.#queueAtom();
	}

	#queueAtom() {
		if (!this.#outbound.length) {
			while (this.#inbound.length) {
				let pip = this.#inbound.pop();
				if (pip) this.#outbound.push(pip);
			}
		}

		this.#inRoute = this.#outbound.pop();
		this.#execAtom();
	}

	async #execAtom() {
		if (this.#inRoute) {
			await this.#inRoute.fetch();
			this.#queueAtom();
		}
	}
}

// QUEUE should just be document wide
// could be a set

// MODULE WIDE MEMORY
// let queueMap = new WeakMap<EventTarget, Queue>();
let queueMap = new Queue();

export function queued(
	dispatchParams: DispatchParams,
	atom: Queueable,
): boolean {
	let queueParams = getQueueParams(dispatchParams);
	if (!queueParams) return false;

	queueMap.enqueue(atom);
	return true;

	// let { queueTarget } = queueParams;
	// let queue = queueMap.get(queueTarget);
	// if (!queue) {
	// 	queue = new Queue();
	// 	queueMap.set(queueTarget, queue);
	// }
	// queue.enqueue(atom);

	// return true;
}

function getQueueParams(
	dispatchParams: DispatchParams,
): QueueParamsInterface | undefined {
	let { element, target, event } = dispatchParams;

	let queueAttr = element.getAttribute(`${event.type}:queue`);
	if (null === queueAttr) return;

	let queueTarget: EventTarget = document;
	if ("_target" === queueAttr) queueTarget = target;

	return { queueTarget };
}
