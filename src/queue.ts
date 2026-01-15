import type { DispatchParams } from "./type_flyweight.js";

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
