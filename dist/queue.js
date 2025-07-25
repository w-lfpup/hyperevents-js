let queueMap = new WeakMap();
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
    if (queue) {
        if (!queue.outgoing.length) {
            while (queue.incoming.length) {
                let entry = queue.incoming.pop();
                if (entry)
                    queue.outgoing.push(entry);
            }
        }
        let entry = queue.outgoing.pop();
        if (entry)
            entry.dispatch(queueNext);
    }
}
export function shouldQueue(dispatchParams, params) {
    let { el, sourceEvent } = dispatchParams;
    let queueTarget = el.getAttribute(`${sourceEvent.type}:queue`);
    if (queueTarget) {
        // throttle by element
        if ("target" === queueTarget)
            return queueTarget;
        if ("currentTarget" === queueTarget)
            return queueTarget;
    }
}
