import { getRequestParams } from "./type_flyweight.js";
import { setThrottler, getThrottleParams, shouldThrottle } from "./throttle.js";
import { getQueueParams, enqueue } from "./queue.js";
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
    let queueParams = getQueueParams(dispatchParams);
    if (queueParams) {
        let entry = new QueueableJson(dispatchParams, requestParams, queueParams, abortController);
        return enqueue(queueParams, entry);
    }
    fetchJson(dispatchParams, requestParams, abortController);
}
class QueueableJson {
    #dispatchParams;
    #requestParams;
    #queueParams;
    #abortController;
    constructor(dispatchParams, requestParams, queueParams, abortController) {
        this.#dispatchParams = dispatchParams;
        this.#requestParams = requestParams;
        this.#queueParams = queueParams;
        this.#abortController = abortController;
    }
    dispatch(queueNextCallback) {
        let { queueTarget } = this.#queueParams;
        let promisedJson = fetchJson(this.#dispatchParams, this.#requestParams, this.#abortController)?.finally(function () {
            queueNextCallback(queueTarget);
        });
        if (!promisedJson) {
            queueNextCallback(queueTarget);
        }
    }
}
function fetchJson(params, requestParams, abortController) {
    let { currentTarget, formData } = params;
    let { url, action, timeoutMs, method } = requestParams;
    if (abortController.signal.aborted || !url || !currentTarget)
        return;
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
    return fetch(request)
        .then(resolveResponseBody)
        .then(function ([response, json]) {
        let event = new JsonEvent({ status: "resolved", response, json, ...actionParams }, eventInitDict);
        currentTarget.dispatchEvent(event);
    })
        .catch(function (error) {
        let event = new JsonEvent({ status: "rejected", error, ...actionParams }, eventInitDict);
        currentTarget.dispatchEvent(event);
    });
}
function resolveResponseBody(response) {
    return Promise.all([response, response.json()]);
}
