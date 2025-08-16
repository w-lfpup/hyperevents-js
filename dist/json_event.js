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
// this could be smaller just as an old school function returns function
class QueueableJson {
    #params;
    constructor(params) {
        this.#params = params;
    }
    dispatch(queueNextCallback) {
        let { actionParams, dispatchParams, queueParams, abortController } = this.#params;
        let { queueTarget } = queueParams;
        let promisedJson = fetchJson(dispatchParams, abortController, actionParams)?.finally(function () {
            queueNextCallback(queueTarget);
        });
        if (!promisedJson) {
            queueNextCallback(queueTarget);
        }
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
        let { queueTarget } = queueParams;
        dispatchParams.currentTarget.dispatchEvent(new JsonEvent({ status: "queued", queueTarget, ...actionParams }));
        let entry = new QueueableJson({
            actionParams,
            dispatchParams,
            queueParams,
            abortController,
        });
        return enqueue(queueParams, entry);
    }
    fetchJson(dispatchParams, abortController, actionParams);
}
function fetchJson(dispatchParams, abortController, actionParams) {
    if (abortController.signal.aborted)
        return;
    let { currentTarget, composed } = dispatchParams;
    let event = new JsonEvent({ status: "requested", ...actionParams }, { bubbles: true, composed });
    currentTarget.dispatchEvent(event);
    return fetch(actionParams.request)
        .then(resolveResponseBody)
        .then(function ([response, json]) {
        let event = new JsonEvent({ status: "resolved", response, json, ...actionParams }, { bubbles: true, composed });
        currentTarget.dispatchEvent(event);
    })
        .catch(function (error) {
        let event = new JsonEvent({ status: "rejected", error, ...actionParams }, { bubbles: true, composed });
        currentTarget.dispatchEvent(event);
    });
}
function resolveResponseBody(response) {
    return Promise.all([response, response.json()]);
}
