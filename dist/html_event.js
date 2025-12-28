import { getRequestParams, createRequest } from "./type_flyweight.js";
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
    let abortController = new AbortController();
    let request = createRequest(dispatchParams, requestParams, abortController);
    let { action } = requestParams;
    let fetchParams = {
        action,
        request,
        abortController,
    };
    fetchHtml(dispatchParams, fetchParams, abortController);
}
function fetchHtml(dispatchParams, fetchParams, abortController) {
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
