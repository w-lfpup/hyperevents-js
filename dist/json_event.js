// asynchronous
// queue-able
// AFAIK we can't use an AbortController on a dynamic import
// but we can on a fetch
// could leave a "status=pending|fulfilled|rejected status:code=200|400|500
import { shouldThrottle, setThrottler } from "./throttle.js";
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
        let params = { el, currentTarget, kind, prefix: "json", action, url };
        if (shouldThrottle(params))
            return;
        let abortController = new AbortController();
        setThrottler(params, abortController);
        // this entire chunk is queue-able
        if (abortController.signal.aborted)
            return;
        let req = new Request(url, {
            signal: AbortSignal.any([
                AbortSignal.timeout(500),
                abortController.signal,
            ]),
        });
        fetch(req)
            .then(function (response) {
            return Promise.all([response, response.text()]);
        })
            .then(function ([res, jsonStr]) {
            let event = new JsonEvent({ action, jsonStr }, { bubbles: true });
            el.dispatchEvent(event);
        })
            .catch(function (reason) {
            console.log("#json error!");
        })
            .finally(function () {
            // call next queue?
        });
        // to here
    }
}
