import { createFetchParams } from "./type_flyweight.js";
import { setThrottler } from "./throttle.js";
export class HtmlEvent extends Event {
    requestState;
    constructor(requestState, eventInit) {
        super("#html", eventInit);
        this.requestState = requestState;
    }
}
export function dispatchHtmlEvent(dispatchParams) {
    let fetchParams = createFetchParams(dispatchParams);
    if (!fetchParams)
        return;
    if (setThrottler(dispatchParams, fetchParams))
        return;
    fetchHtml(dispatchParams, fetchParams);
}
function fetchHtml(dispatchParams, fetchParams) {
    if (fetchParams.request.signal.aborted)
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
