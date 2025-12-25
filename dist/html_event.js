import { getRequestParams, createRequest } from "./type_flyweight.js";
import { setThrottler, getThrottleParams, shouldThrottle } from "./throttle.js";
import { getQueueParams, enqueue, Queueable } from "./queue.js";
export class HtmlEvent extends Event {
    requestState;
    constructor(requestState, eventInit) {
        super("#html", eventInit);
        this.requestState = requestState;
    }
}
export function dispatchHtmlEvent(dispatchParams) {
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
        let entry = new Queueable({
            fetchCallback: fetchHtml,
            dispatchParams,
            queueParams,
            fetchParams,
            abortController,
        });
        return enqueue(queueParams, entry);
    }
    fetchHtml(fetchParams, dispatchParams, abortController);
}
function fetchHtml(fetchParams, dispatchParams, abortController) {
    if (abortController.signal.aborted)
        return;
    let { target, composed } = dispatchParams;
    let event = new HtmlEvent({ status: "requested", ...fetchParams }, { bubbles: true, composed });
    target.dispatchEvent(event);
    return fetch(fetchParams.request)
        .then(resolveResponseBody)
        .then(function ([response, html]) {
        let event = new HtmlEvent({ status: "resolved", response, html, ...fetchParams }, { bubbles: true, composed });
        target.dispatchEvent(event);
    })
        .catch(function (error) {
        let event = new HtmlEvent({ status: "rejected", error, ...fetchParams }, { bubbles: true, composed });
        target.dispatchEvent(event);
    });
}
function resolveResponseBody(response) {
    return Promise.all([response, response.text()]);
}
