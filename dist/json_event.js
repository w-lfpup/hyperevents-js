import { getRequestParams, createRequest } from "./type_flyweight.js";
import { setThrottler, getThrottleParams, shouldThrottle } from "./throttle.js";
import { getQueueParams, enqueue } from "./queue.js";
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
    let throttleParams = getThrottleParams(dispatchParams);
    if (shouldThrottle(dispatchParams, throttleParams))
        return;
    let abortController = new AbortController();
    setThrottler(dispatchParams, throttleParams, abortController);
    let request = createRequest(dispatchParams, requestParams, abortController);
    if (!request)
        return;
    let { action } = requestParams;
    let fetchParams = {
        action,
        request,
        abortController,
    };
    let queueParams = getQueueParams(dispatchParams);
    if (queueParams) {
        let { queueTarget } = queueParams;
        dispatchParams.target.dispatchEvent(new JsonEvent({ status: "queued", queueTarget, ...fetchParams }));
        return enqueue({
            fetchCallback: fetchJson,
            fetchParams,
            dispatchParams,
            queueParams,
            abortController,
        });
    }
    fetchJson(fetchParams, dispatchParams, abortController);
}
function fetchJson(fetchParams, dispatchParams, abortController) {
    if (abortController.signal.aborted)
        return;
    let { target, composed } = dispatchParams;
    let event = new JsonEvent({ status: "requested", ...fetchParams }, { bubbles: true, composed });
    target.dispatchEvent(event);
    return fetch(fetchParams.request)
        .then(resolveResponseBody)
        .then(function ([response, json]) {
        let event = new JsonEvent({ status: "resolved", response, json, ...fetchParams }, { bubbles: true, composed });
        target.dispatchEvent(event);
    })
        .catch(function (error) {
        let event = new JsonEvent({ status: "rejected", error, ...fetchParams }, { bubbles: true, composed });
        target.dispatchEvent(event);
    });
}
function resolveResponseBody(response) {
    return Promise.all([response, response.json()]);
}
