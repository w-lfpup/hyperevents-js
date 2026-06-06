/*
	For now the queue-state resides in module scope.
	
	A stretch-goal might be attaching the queue map to the window itself.
*/

interface Params {
	target: Element;
	event: Event;
}

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

export function queued(dispatchParams: Params, atom: Queueable): boolean {
	let { target, event } = dispatchParams;

	let queueAttr = target.hasAttribute(`${event.type}:queue`);
	if (queueAttr) queueMap.enqueue(atom);

	return queueAttr;
}
