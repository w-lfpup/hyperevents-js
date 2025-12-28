import type { DispatchParams } from "./type_flyweight.js";

export interface QueueParamsInterface {
	queueTarget: EventTarget;
}

export interface QueuableInterface {
	dispatch(): void;
}

export interface FetchCallback<A> {
	(fetchParams: A, dispatchParams: DispatchParams): Promise<void> | undefined;
}

interface Queue {
	incoming: QueuableInterface[];
	outgoing: QueuableInterface[];
}

let queueMap = new WeakMap<EventTarget, Queue>();

interface QueuableParams<A> {
	dispatchParams: DispatchParams;
	fetchCallback: FetchCallback<A>;
	fetchParams: A;
	queueParams: QueueParamsInterface;
}

export class Queueable<A> implements QueuableInterface {
	#params: QueuableParams<A>;

	constructor(params: QueuableParams<A>) {
		this.#params = params;
	}

	dispatch() {
		let { dispatchParams, fetchCallback, fetchParams, queueParams } =
			this.#params;
		let { queueTarget } = queueParams;

		let promisedJson = fetchCallback(fetchParams, dispatchParams)?.finally(
			function () {
				queueNext(queueTarget);
			},
		);

		if (!promisedJson) {
			queueNext(queueTarget);
		}
	}
}

export function getQueueParams(
	dispatchParams: DispatchParams,
): QueueParamsInterface | undefined {
	let { el, target, sourceEvent } = dispatchParams;

	let queueTargetAttr = el.getAttribute(`${sourceEvent.type}:queue`);
	if (!queueTargetAttr) return;

	let queueTarget: EventTarget = document;
	if ("_target" === queueTargetAttr) queueTarget = target;

	return { queueTarget };
}

export function enqueue<A>(params: QueuableParams<A>) {
	let { queueTarget } = params.queueParams;
	let queue = queueMap.get(queueTarget);
	if (!queue) {
		let freshQueue = {
			incoming: [],
			outgoing: [],
		};
		queueMap.set(queueTarget, freshQueue);
		queue = freshQueue;
	}

	let entry = new Queueable(params);
	queue.incoming.push(entry);
	queueNext(queueTarget);
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

	queue.outgoing.pop()?.dispatch();
}
