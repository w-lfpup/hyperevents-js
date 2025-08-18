import { getRequestParams, createRequest } from "./type_flyweight.js";
import { setThrottler, getThrottleParams, shouldThrottle } from "./throttle.js";
import { getQueueParams, enqueue, Queueable } from "./queue.js";
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
    if (shouldThrottle(dispatchParams, throttleParams))
        return;
    let abortController = new AbortController();
    setThrottler(dispatchParams, throttleParams, abortController);
    let request = createRequest(dispatchParams, requestParams, abortController);
    if (!request)
        return;
    let { action } = requestParams;
    let fetchParams = { action, request, abortController };
    let queueParams = getQueueParams(dispatchParams);
    if (queueParams) {
        let { queueTarget } = queueParams;
        dispatchParams.currentTarget.dispatchEvent(new JsonEvent({ status: "queued", queueTarget, ...fetchParams }));
        let entry = new Queueable({
            fetchCallback: fetchJson,
            fetchParams,
            dispatchParams,
            queueParams,
            abortController,
        });
        return enqueue(queueParams, entry);
    }
    fetchJson(dispatchParams, abortController, fetchParams);
}
function fetchJson(dispatchParams, abortController, actionParams) {
    if (abortController.signal.aborted)
        return;
    let { el, composed } = dispatchParams;
    let event = new JsonEvent({ status: "requested", ...actionParams }, { bubbles: true, composed });
    el.dispatchEvent(event);
    return fetch(actionParams.request)
        .then(resolveResponseBody)
        .then(function ([response, json]) {
        let event = new JsonEvent({ status: "resolved", response, json, ...actionParams }, { bubbles: true, composed });
        el.dispatchEvent(event);
    })
        .catch(function (error) {
        let event = new JsonEvent({ status: "rejected", error, ...actionParams }, { bubbles: true, composed });
        el.dispatchEvent(event);
    });
}
function resolveResponseBody(response) {
    return Promise.all([response, response.json()]);
}
