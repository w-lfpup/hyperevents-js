import { getRequestParams, createRequest } from "./type_flyweight.js";
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
    let abortController = new AbortController();
    let request = createRequest(dispatchParams, requestParams, abortController);
    let { action } = requestParams;
    let fetchParams = {
        action,
        request,
        abortController,
    };
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
