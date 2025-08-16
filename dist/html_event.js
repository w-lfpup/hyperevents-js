// asynchronous
// queue-able
import { getRequestParams, createRequest } from "./type_flyweight.js";
import { setThrottler, getThrottleParams, shouldThrottle } from "./throttle.js";
import { getQueueParams, enqueue } from "./queue.js";
export class HtmlEvent extends Event {
    requestState;
    constructor(requestState, eventInit) {
        super("#html", eventInit);
        this.requestState = requestState;
    }
}
class QueueableHtml {
    #params;
    constructor(params) {
        this.#params = params;
    }
    dispatch(queueNextCallback) {
        let { htmlParams, dispatchParams, queueParams, abortController } = this.#params;
        let { queueTarget } = queueParams;
        let promisedJson = fetchHtml(dispatchParams, abortController, htmlParams)?.finally(function () {
            queueNextCallback(queueTarget);
        });
        if (!promisedJson) {
            queueNextCallback(queueTarget);
        }
    }
}
export function dispatchHtmlEvent(dispatchParams) {
    let requestParams = getRequestParams(dispatchParams);
    if (!requestParams)
        return;
    let throttleParams = getThrottleParams(dispatchParams, "html");
    if (shouldThrottle(dispatchParams, requestParams, throttleParams))
        return;
    let abortController = new AbortController();
    setThrottler(dispatchParams, requestParams, throttleParams, abortController);
    let request = createRequest(dispatchParams, requestParams, abortController);
    if (!request)
        return;
    let { action } = requestParams;
    let htmlParams = { action, request };
    let queueParams = getQueueParams(dispatchParams);
    if (queueParams) {
        let entry = new QueueableHtml({
            dispatchParams,
            queueParams,
            htmlParams,
            abortController,
        });
        return enqueue(queueParams, entry);
    }
    fetchHtml(dispatchParams, abortController, htmlParams);
}
function fetchHtml(dispatchParams, abortController, actionParams) {
    if (abortController.signal.aborted)
        return;
    let { currentTarget, composed } = dispatchParams;
    let event = new HtmlEvent({ status: "requested", ...actionParams }, { bubbles: true, composed });
    currentTarget.dispatchEvent(event);
    return fetch(actionParams.request)
        .then(resolveResponseBody)
        .then(function ([response, htmlStr]) {
        let html = new HTMLTemplateElement();
        html.innerHTML = htmlStr;
        let event = new HtmlEvent({ status: "resolved", response, html, ...actionParams }, { bubbles: true, composed });
        currentTarget.dispatchEvent(event);
    })
        .catch(function (error) {
        let event = new HtmlEvent({ status: "rejected", error, ...actionParams }, { bubbles: true, composed });
        currentTarget.dispatchEvent(event);
    });
}
function resolveResponseBody(response) {
    return Promise.all([response, response.text()]);
}
