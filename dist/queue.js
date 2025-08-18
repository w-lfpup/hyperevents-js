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
export function getQueueParams(dispatchParams) {
    let { el, currentTarget, sourceEvent } = dispatchParams;
    let queueTargetAttr = el.getAttribute(`${sourceEvent.type}:queue`);
    if (!queueTargetAttr)
        return;
    let queueTarget = currentTarget;
    if ("_target" === queueTargetAttr)
        queueTarget = el;
    if ("_document" === queueTargetAttr)
        queueTarget = document;
    return { queueTarget };
}
export function enqueue(params, queueEntry) {
    let { queueTarget } = params;
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
