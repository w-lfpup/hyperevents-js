// asynchronous
// queue-able
export class JsonEvent extends Event {
    #params;
    constructor(params, eventInit) {
        super("#json", eventInit);
        this.#params = params;
    }
    get jsonParams() {
        return this.#params;
    }
}
export function dispatchJsonEvent(dispatchParams) {
    let { el, sourceEvent } = dispatchParams;
    let { type } = sourceEvent;
    let action = el.getAttribute(`${type}:action`);
    let url = el.getAttribute(`${type}:url`);
    if (url) {
        // let throttleParams = getThrottleParams(dispatchParams, "json", action);
        // if (shouldThrottle(dispatchParams, throttleParams)) return;
        // setThrottler(dispatchParams, throttleParams);
        // let abortController = new AbortController();
        // setThrottler(params, abortController);
        // if (shouldQueue(params)) {
        // 	let entry = new QueueableJson(params, abortController);
        // 	return enqueue(el, entry);
        // }
        // fetchJson(params, abortController);
    }
}
class QueueableJson {
    #params;
    #abortController;
    constructor(params, abortController) {
        this.#params = params;
        this.#abortController = abortController;
    }
    dispatch(queueNextCallback) {
        fetchJson(this.#params, this.#abortController, queueNextCallback);
    }
}
function fetchJson(params, abortController, queueNextCallback) {
    if (abortController.signal.aborted)
        return;
    let { url, action, el } = params;
    if (!url)
        return;
    // if timeout add to queue
    let req = new Request(url, {
        signal: AbortSignal.any([AbortSignal.timeout(500), abortController.signal]),
    });
    fetch(req)
        .then(function (response) {
        return Promise.all([response, response.text()]);
    })
        .then(function ([response, jsonStr]) {
        let event = new JsonEvent({ response, action, jsonStr }, { bubbles: true });
        el.dispatchEvent(event);
    })
        .catch(function (_reason) {
        console.log("#json error!");
    })
        .finally(function () {
        if (queueNextCallback)
            queueNextCallback(el);
    });
}
