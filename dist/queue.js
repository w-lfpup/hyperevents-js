let queueMap = new WeakMap();
// can combine these
export function enqueue(el, queueEntry) {
    // add function to queue
    let queue = queueMap.get(el);
    if ("enqueued" === queue?.status) {
        queue.incoming.push(queueEntry);
        return;
    }
    let freshQueue = {
        status: "enqueued",
        incoming: [],
        outgoing: [],
    };
    queueMap.set(el, freshQueue);
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
export function shouldQueue(dispatchParams) {
    let { el, currentTarget, sourceEvent } = dispatchParams;
    let queueTarget = el.getAttribute(`${sourceEvent.type}:queue`);
    if (queueTarget) {
        // throttle by element
        if ("_target" === queueTarget)
            return el;
        if (currentTarget && "_currentTarget" === queueTarget)
            return currentTarget;
    }
}
