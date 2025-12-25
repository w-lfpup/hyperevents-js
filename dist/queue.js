let queueMap = new WeakMap();
export class Queueable {
    #params;
    constructor(params) {
        this.#params = params;
    }
    dispatch() {
        let { abortController, dispatchParams, fetchCallback, fetchParams, queueParams, } = this.#params;
        let { queueTarget } = queueParams;
        let promisedJson = fetchCallback(fetchParams, dispatchParams, abortController)?.finally(function () {
            queueNext(queueTarget);
        });
        if (!promisedJson) {
            queueNext(queueTarget);
        }
    }
}
export function getQueueParams(dispatchParams) {
    let { el, target, sourceEvent } = dispatchParams;
    let queueTargetAttr = el.getAttribute(`${sourceEvent.type}:queue`);
    if (!queueTargetAttr)
        return;
    let queueTarget = target;
    if ("_document" === queueTargetAttr)
        queueTarget = document;
    return { queueTarget };
}
export function enqueue(params, queueEntry) {
    let { queueTarget } = params;
    let queue = queueMap.get(queueTarget);
    if (!queue) {
        let freshQueue = {
            incoming: [],
            outgoing: [],
        };
        queueMap.set(queueTarget, freshQueue);
        queue = freshQueue;
    }
    queue.incoming.push(queueEntry);
    queueNext(queueTarget);
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
