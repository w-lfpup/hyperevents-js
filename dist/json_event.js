import { createFetchParams } from "./type_flyweight.js";
import { throttled } from "./throttle.js";
import { queued } from "./queue.js";
export class JsonEvent extends Event {
    #requestState;
    constructor(requestState, eventInitDict) {
        super("#json", eventInitDict);
        this.#requestState = requestState;
    }
    get requestState() {
        return this.#requestState;
    }
}
export function dispatchJsonEvent(dispatchParams) {
    let fetchParams = createFetchParams(dispatchParams);
    if (!fetchParams)
        return;
    if (throttled(dispatchParams, fetchParams))
        return;
    let jsonFetch = new JsonFetch(dispatchParams, fetchParams);
    if (queued(dispatchParams, jsonFetch))
        return;
    jsonFetch.fetch();
}
class JsonFetch {
    #dispatchParams;
    #fetchParams;
    constructor(dispatchParams, fetchParams) {
        this.#dispatchParams = dispatchParams;
        this.#fetchParams = fetchParams;
    }
    dispatchQueueEvent() {
        let { target, composed } = this.#dispatchParams;
        let event = new JsonEvent({ status: "queued", ...this.#fetchParams }, { bubbles: true, composed });
        target.dispatchEvent(event);
    }
    fetch() {
        return fetchJson(this.#dispatchParams, this.#fetchParams);
    }
}
function fetchJson(dispatchParams, fetchParams) {
    if (fetchParams.abortController.signal.aborted)
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
