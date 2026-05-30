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

// For now, queue target is ALWAYS the document.
export function queued(
	dispatchParams: DispatchParams,
	atom: Queueable,
): boolean {
	let { target, event } = dispatchParams;

	if (target.hasAttribute(`${event.type}:queue`)) {
		queueMap.enqueue(atom);
		return true;
	}

	return false;
}
