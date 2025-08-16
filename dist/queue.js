let queueMap = new WeakMap();
export class Queueable {
    #params;
    constructor(params) {
        this.#params = params;
    }
    dispatch() {
        let { fetchParams, fetchCallback, dispatchParams, queueParams, abortController, } = this.#params;
        let { queueTarget } = queueParams;
        let promisedJson = fetchCallback(dispatchParams, abortController, fetchParams)?.finally(function () {
            queueNext(queueTarget);
        });
        if (!promisedJson) {
            queueNext(queueTarget);
        }
    }
}
// can combine these
export function enqueue(params, queueEntry) {
    let { queueTarget } = params;
    // add function to queue
    let queue = queueMap.get(queueTarget);
    if ("enqueued" === queue?.status) {
        queue.incoming.push(queueEntry);
        return;
    }
    let freshQueue = {
        status: "enqueued",
        incoming: [],
        outgoing: [],
    };
    queueMap.set(queueTarget, freshQueue);
    queueEntry.dispatch();
}
function queueNext(el) {
    let queue = queueMap.get(el);
    if (!queue)
        return;
    if (!queue.outgoing.length) {
        while (queue.incoming.length) {
            let pip = queue.incoming.pop();
            if (pip)
                queue.outgoing.push(pip);
        }
    }
    queue.outgoing.pop()?.dispatch();
}
export function getQueueParams(dispatchParams) {
    let { el, currentTarget, sourceEvent } = dispatchParams;
    let queueTarget = el.getAttribute(`${sourceEvent.type}:queue`);
    if (queueTarget) {
        // throttle by element
        if ("_target" === queueTarget)
            return { queueTarget: el };
        if ("_document" === queueTarget)
            return { queueTarget: document };
        if (currentTarget instanceof Element && "_currentTarget" === queueTarget)
            return { queueTarget: currentTarget };
    }
}
