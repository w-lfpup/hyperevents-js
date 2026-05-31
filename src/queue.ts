/*
	For now the queue resides in module scope.

	I don't know why this makes sense right now. But I feel like queues
	are a way to throttle resource consumption as well as order resource
	consumption. And even if different hosts queued different resources
	I'd want them to stack regardless and see a progression occur.

	So a module-scoped queue is useful at the moment.
	Multiple bundles would mean multiple queues however.
*/

import type { DispatchParams } from "./type_flyweight.js";

export interface Queueable {
	dispatchQueueEvent(): void;
	fetch(): Promise<void> | undefined;
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

let queueMap = new Queue();

export function queued(
	dispatchParams: DispatchParams,
	atom: Queueable,
): boolean {
	let { target, event } = dispatchParams;

	let queueAttr = target.hasAttribute(`${event.type}:queue`);
	if (queueAttr) queueMap.enqueue(atom);

	return queueAttr;
}
