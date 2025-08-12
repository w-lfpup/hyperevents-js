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
    let request = createRequest(dispatchParams, requestParams, abortController);
    if (!request)
        return;
    let { action } = requestParams;
    let actionParams = { action, request };
    let queueParams = getQueueParams(dispatchParams);
    if (queueParams) {
        // separate function
        let { queueTarget } = queueParams;
        let { currentTarget } = dispatchParams;
        currentTarget.dispatchEvent(new JsonEvent({ status: "queued", queueTarget, ...actionParams }));
        let entry = new QueueableJson({
            actionParams,
            dispatchParams,
            queueParams,
            abortController,
        });
        return enqueue(queueParams, entry);
    }
    fetchJson(dispatchParams, actionParams, abortController);
}
// this could be smaller just as an old school function returns function
class QueueableJson {
    #params;
    constructor(params) {
        this.#params = params;
    }
    dispatch(queueNextCallback) {
        let { actionParams, dispatchParams, queueParams, abortController } = this.#params;
        let { queueTarget } = queueParams;
        let promisedJson = fetchJson(dispatchParams, actionParams, abortController)?.finally(function () {
            queueNextCallback(queueTarget);
        });
        if (!promisedJson) {
            queueNextCallback(queueTarget);
        }
    }
}
function createRequest(dispatchParams, requestParams, abortController) {
    let { formData } = dispatchParams;
    let { url, timeoutMs, method } = requestParams;
    let abortSignals = [abortController.signal];
    if (timeoutMs)
        abortSignals.push(AbortSignal.timeout(timeoutMs));
    if (url) {
        return new Request(url, {
            signal: AbortSignal.any(abortSignals),
            method: method ?? "GET",
            body: formData,
        });
    }
}
function fetchJson(params, actionParams, abortController) {
    if (abortController.signal.aborted)
        return;
    let { currentTarget } = params;
    let event = new JsonEvent({ status: "requested", ...actionParams }, eventInitDict);
    currentTarget.dispatchEvent(event);
    return fetch(actionParams.request)
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
