import { getRequestParams } from "./type_flyweight.js";
import { setThrottler, getThrottleParams, shouldThrottle } from "./throttle.js";
import { shouldQueue, enqueue } from "./queue.js";
const eventInitDict = { bubbles: true, composed: true };
export class JsonEvent extends Event {
    requestState;
    constructor(requestState, eventInitDict) {
        super("#json", eventInitDict);
        this.requestState = requestState;
    }
}
export function dispatchJsonEvent(dispatchParams) {
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
    // el needs to be the designated queue target element?
    let { el, currentTarget, formData } = params;
    let { url, action, timeoutMs, method } = requestParams;
    if (abortController.signal.aborted || !url || !currentTarget) {
        queueNextCallback?.(el);
    }
    else {
        let abortSignals = [abortController.signal];
        if (timeoutMs)
            abortSignals.push(AbortSignal.timeout(timeoutMs));
        let request = new Request(url, {
            signal: AbortSignal.any(abortSignals),
            method: method ?? "GET",
            body: formData,
        });
        let actionParams = { action, request, url };
        let event = new JsonEvent({ status: "requested", ...actionParams }, eventInitDict);
        currentTarget.dispatchEvent(event);
        fetch(request)
            .then(resolveResponseBody)
            .then(function ([response, json]) {
            let event = new JsonEvent({ status: "resolved", response, json, ...actionParams }, eventInitDict);
            currentTarget.dispatchEvent(event);
        })
            .catch(function (error) {
            let event = new JsonEvent({ status: "rejected", error, ...actionParams }, eventInitDict);
            currentTarget.dispatchEvent(event);
        })
            .finally(function () {
            queueNextCallback?.(el);
        });
    }
}
function resolveResponseBody(response) {
    return Promise.all([response, response.json()]);
}
