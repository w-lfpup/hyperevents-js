// asynchronous
// queue-able
import { getRequestParams } from "./type_flyweight.js";
import { setThrottler, getThrottleParams } from "./throttle.js";
import { shouldQueue, enqueue } from "./queue.js";
export class HtmlEvent extends Event {
    #params;
    constructor(params, eventInit) {
        super("#html", eventInit);
        this.#params = params;
    }
    get htmlParams() {
        return this.#params;
    }
}
// projection="swap"
// projection-target="match | querySelector | querySelectorAll"
// projection-selector="ul"
// status-target="match | querySelector | querySelectorAll" | default is querySelector
// status-selector="selector" pending | completed
export function dispatchHtmlEvent(dispatchParams) {
    let reqParams = getRequestParams(dispatchParams);
    if (!reqParams)
        return;
    // get request params
    let throttleParams = getThrottleParams(dispatchParams, reqParams, "html");
    let abortController = new AbortController();
    if (throttleParams)
        setThrottler(dispatchParams, reqParams, throttleParams, abortController);
    let queueTarget = shouldQueue(dispatchParams);
    if (queueTarget) {
        let entry = new QueueableHtml(dispatchParams, reqParams, abortController);
        return enqueue(queueTarget, entry);
    }
    fetchHtml(dispatchParams, reqParams, abortController);
}
class QueueableHtml {
    #dispatchParams;
    #requestParams;
    #abortController;
    constructor(dispatchParams, requestParams, abortController) {
        this.#dispatchParams = dispatchParams;
        this.#requestParams = requestParams;
        this.#abortController = abortController;
    }
    dispatch(queueNextCallback) {
        fetchHtml(this.#dispatchParams, this.#requestParams, this.#abortController, queueNextCallback);
    }
}
function fetchHtml(params, requestParams, abortController, queueNextCallback) {
    let { el, formData } = params;
    let { url, timeoutMs, method } = requestParams;
    if (!abortController.signal.aborted && url) {
        // if timeout add to queue
        let abortSignals = [abortController.signal];
        if (timeoutMs)
            abortSignals.push(AbortSignal.timeout(timeoutMs));
        let req = new Request(url, {
            signal: AbortSignal.any(abortSignals),
            method: method ?? "GET",
            body: formData,
        });
        return fetch(req)
            .then(resolveResponseBody)
            .then(function ([response, html]) {
            // do projection here
            let event = new HtmlEvent({ response, html }, { bubbles: true });
            el.dispatchEvent(event);
        })
            .catch(function (_reason) {
            console.log("#json error!");
        })
            .finally(function () {
            if (queueNextCallback)
                queueNextCallback(el);
        });
    }
    if (queueNextCallback)
        queueNextCallback(el);
}
function resolveResponseBody(response) {
    return Promise.all([response, response.text()]);
}
