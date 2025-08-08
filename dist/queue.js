let queueMap = new WeakMap();
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
    queueEntry.dispatch(queueNext);
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
    queue.outgoing.pop()?.dispatch(queueNext);
}
export function getQueueParams(dispatchParams) {
    let { el, currentTarget, sourceEvent } = dispatchParams;
    let queueTarget = el.getAttribute(`${sourceEvent.type}:queue`);
    if (queueTarget) {
        // throttle by element
        if ("_target" === queueTarget)
            return { queueTarget: el };
        if (currentTarget instanceof Element && "_currentTarget" === queueTarget)
            return { queueTarget: currentTarget };
    }
}
