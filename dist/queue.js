let queueMap = new WeakMap();
class QueuedAtom {
    #atom;
    constructor(atom) {
        this.#atom = atom;
    }
    dispatch(queueTarget) {
        let promise = this.#atom.fetch();
        promise
            ? promise.finally(function () {
                queueNext(queueTarget);
            })
            : queueNext(queueTarget);
    }
}
export function queued(dispatchParams, atom) {
    let queueParams = getQueueParams(dispatchParams);
    if (!queueParams)
        return false;
    let { queueTarget } = queueParams;
    let queue = queueMap.get(queueTarget);
    if (!queue) {
        let freshQueue = {
            incoming: [],
            outgoing: [],
        };
        queueMap.set(queueTarget, freshQueue);
        queue = freshQueue;
    }
    atom.dispatchQueueEvent();
    let entry = new QueuedAtom(atom);
    queue.incoming.push(entry);
    queueNext(queueTarget);
    return true;
}
function getQueueParams(dispatchParams) {
    let { el, target, sourceEvent } = dispatchParams;
    let queueAttr = el.getAttribute(`${sourceEvent.type}:queue`);
    if (null === queueAttr)
        return;
    let queueTarget = document;
    if ("_target" === queueAttr)
        queueTarget = target;
    return { queueTarget };
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
    queue.outgoing.pop()?.dispatch(el);
}
