// asynchronous
// queue-able
import { getRequestParams } from "./type_flyweight.js";
import { setThrottler, getThrottleParams, shouldThrottle } from "./throttle.js";
import { shouldQueue, enqueue } from "./queue.js";
const eventInitDict = { bubbles: true, composed: true };
export class HtmlEvent extends Event {
    #status;
    constructor(status, eventInit) {
        super("#html", eventInit);
        // this.#params = params;
        this.#status = status;
    }
    get status() {
        return this.#status;
    }
}
// projection="swap"
// projection-target="match | querySelector | querySelectorAll"
// projection-selector="ul"
// status-target="match | querySelector | querySelectorAll" | default is querySelector
// status-selector="selector" pending | completed
export function dispatchHtmlEvent(dispatchParams) {
    let requestParams = getRequestParams(dispatchParams);
    if (!requestParams)
        return;
    let throttleParams = getThrottleParams(dispatchParams, "html");
    if (shouldThrottle(dispatchParams, requestParams, throttleParams))
        return;
    let abortController = new AbortController();
    if (throttleParams)
        setThrottler(dispatchParams, requestParams, throttleParams, abortController);
    let queueTarget = shouldQueue(dispatchParams);
    if (queueTarget) {
        let entry = new QueueableHtml(dispatchParams, requestParams, abortController);
        return enqueue(queueTarget, entry);
    }
    fetchHtml(dispatchParams, requestParams, abortController);
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
    if (abortController.signal.aborted || !url) {
        queueNextCallback?.(el);
    }
    else {
        // if timeout add to queue
        let abortSignals = [abortController.signal];
        if (timeoutMs)
            abortSignals.push(AbortSignal.timeout(timeoutMs));
        let req = new Request(url, {
            signal: AbortSignal.any(abortSignals),
            method: method ?? "GET",
            body: formData,
        });
        let event = new HtmlEvent("requested", eventInitDict);
        el.dispatchEvent(event);
        fetch(req)
            .then(resolveResponseBody)
            .then(function ([response, html]) {
            let event = new HtmlEvent("resolved", eventInitDict);
            el.dispatchEvent(event);
        })
            .catch(function (_reason) {
            let event = new HtmlEvent("rejected", eventInitDict);
            el.dispatchEvent(event);
        })
            .finally(function () {
            queueNextCallback?.(el);
        });
    }
}
function resolveResponseBody(response) {
    return Promise.all([response, response.text()]);
}
