// asynchronous
// queue-able
import { shouldThrottle, setThrottler } from "./throttle.js";
import { shouldQueue, enqueue } from "./queue.js";
export class JsonEvent extends Event {
    #params;
    constructor(params, eventInit) {
        super("#json", eventInit);
        this.#params = params;
    }
    get jsonParams() {
        return this.#params;
    }
}
export function dispatchJsonEvent(el, currentTarget, kind) {
    let action = el.getAttribute(`${kind}:action`);
    let url = el.getAttribute(`${kind}:url`);
    if (url) {
        let params = { prefix: "json", el, currentTarget, kind, action, url };
        if (shouldThrottle(params))
            return;
        let abortController = new AbortController();
        setThrottler(params, abortController);
        // this entire chunk is queue-able
        let queueParams = { prefix: "json", el, currentTarget, kind, action, url };
        if (shouldQueue(params)) {
            let entry = new JsonRequest(params, abortController);
            enqueue(el, entry);
        }
    }
}
class JsonRequest {
    #params;
    #abortController;
    constructor(params, abortController) {
        this.#params = params;
        this.#abortController = abortController;
    }
    dispatch(queueNextCallback) {
        if (this.#abortController.signal.aborted)
            return;
        let { url, action, el } = this.#params;
        if (!url)
            return;
        let req = new Request(url, {
            signal: AbortSignal.any([
                AbortSignal.timeout(500),
                this.#abortController.signal,
            ]),
        });
        fetch(req)
            .then(function (response) {
            return Promise.all([response, response.text()]);
        })
            .then(function ([response, jsonStr]) {
            let event = new JsonEvent({ response, action, jsonStr }, { bubbles: true });
            el.dispatchEvent(event);
        })
            .catch(function (reason) {
            console.log("#json error!");
        })
            .finally(function () {
            queueNextCallback(el);
        });
    }
}
