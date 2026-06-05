/*
	For now the queue resides in module scope.

	I don't know why this makes sense right now. But I feel like queues
	are a way to order as well as throttle resource consumption.
	
	And even if different hosts queued different resources
	I'd expect them to stack document-wide / tab-wide.

	So a module-scoped queue is useful at the moment.
	Multiple bundles would mean multiple queues however.
	
	A stretch-goal might be attaching the queue map to the window itself.
*/

import type { DispatchParams } from "./type_flyweight.js";

export interface Queueable {
	queued(): void;
	fetch(): Promise<void> | undefined;
}

class Queue {
	#inRoute: Queueable | undefined;
	#inbound: Queueable[] = [];
	#outbound: Queueable[] = [];

	enqueue(atom: Queueable) {
		this.#inbound.push(atom);
		atom.queued();

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
