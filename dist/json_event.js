// asynchronous
// queue-able
import { getRequestParams } from "./type_flyweight.js";
import { setThrottler, getThrottleParams, shouldThrottle } from "./throttle.js";
import { shouldQueue, enqueue } from "./queue.js";
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
    // get request params
    let requestParams = getRequestParams(dispatchParams);
    if (!requestParams)
        return;
    let throttleParams = getThrottleParams(dispatchParams, "json");
    if (shouldThrottle(dispatchParams, requestParams, throttleParams))
        return;
    let abortController = new AbortController();
    setThrottler(dispatchParams, requestParams, throttleParams, abortController);
    let queueTarget = shouldQueue(dispatchParams);
    if (queueTarget) {
        let entry = new QueueableJson(dispatchParams, requestParams, abortController);
        return enqueue(queueTarget, entry);
    }
    fetchJson(dispatchParams, requestParams, abortController);
}
class QueueableJson {
    #dispatchParams;
    #requestParams;
    #abortController;
    constructor(dispatchParams, requestParams, abortController) {
        this.#dispatchParams = dispatchParams;
        this.#requestParams = requestParams;
        this.#abortController = abortController;
    }
    dispatch(queueNextCallback) {
        fetchJson(this.#dispatchParams, this.#requestParams, this.#abortController, queueNextCallback);
    }
}
function fetchJson(params, requestParams, abortController, queueNextCallback) {
    let { el, formData } = params;
    let { url, action, timeoutMs, method } = requestParams;
    if (!abortController.signal.aborted && url) {
        // if timeout add to queue
        let abortSignals = [abortController.signal];
        if (timeoutMs)
            abortSignals.push(AbortSignal.timeout(timeoutMs));
        let req = new Request(url, {
            signal: AbortSignal.any(abortSignals),
            method: method ?? "GET",
            body: formData,
        });
        return fetch(req)
            .then(resolveResponseBody)
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
    if (queueNextCallback)
        queueNextCallback(el);
}
function resolveResponseBody(response) {
    return Promise.all([response, response.text()]);
}
