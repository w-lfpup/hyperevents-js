import { createFetchParams } from "./type_flyweight.js";
import { throttled } from "./throttle.js";
import { queued } from "./queue.js";
export class HtmlEvent extends Event {
    #requestState;
    constructor(requestState, eventInit) {
        super("#html", eventInit);
        this.#requestState = requestState;
    }
    get requestState() {
        return this.#requestState;
    }
}
class HtmlFetch {
    #dispatchParams;
    #fetchParams;
    constructor(dispatchParams, fetchParams) {
        this.#dispatchParams = dispatchParams;
        this.#fetchParams = fetchParams;
    }
    dispatchQueueEvent() {
        let { target, composed } = this.#dispatchParams;
        let event = new HtmlEvent({ status: "queued", ...this.#fetchParams }, { bubbles: true, composed });
        target.dispatchEvent(event);
    }
    fetch() {
        return fetchHtml(this.#dispatchParams, this.#fetchParams);
    }
}
export function dispatchHtmlEvent(dispatchParams) {
    let fetchParams = createFetchParams(dispatchParams);
    if (!fetchParams)
        return;
    if (throttled(dispatchParams, fetchParams))
        return;
    let htmlFetch = new HtmlFetch(dispatchParams, fetchParams);
    if (queued(dispatchParams, htmlFetch))
        return;
    htmlFetch.fetch();
}
function fetchHtml(dispatchParams, fetchParams) {
    if (fetchParams.abortController.signal.aborted)
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
