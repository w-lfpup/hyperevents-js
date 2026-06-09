/*
	For now the queue-state resides in module scope.
	
	A stretch-goal might be attaching the queue map to the window itself.
*/
import type { DispatchParams, Queueable } from "./type_flyweight.js";

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
	let { target, event, infix } = dispatchParams;

	let queueAttr = target.hasAttribute(`${event.type}${infix}queue`);
	if (queueAttr) queueMap.enqueue(atom);

	return queueAttr;
}
