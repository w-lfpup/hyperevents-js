// asynchronous
// queue-able
// could leave a "status=pending|fulfilled|rejected status:code=200|400|500
// AFAIK we can't use an AbortController on a dynamic import
// but we can on a fetch
import { shouldThrottle, setThrottler } from "./throttle.js";
export function dispatchHtmlEvent(el, currentTarget, kind) {
    let url = el.getAttribute(`${kind}:url`);
    if (url) {
        let params = { prefix: "json", el, currentTarget, kind, url };
        if (shouldThrottle(params))
            return;
        let abortController = new AbortController();
        setThrottler(params, abortController);
        // this entire chunk is queue-able
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
            .then(function ([res, htmlStr]) {
            console.log(htmlStr);
        })
            .catch(function (reason) {
            console.log("#html error!");
        });
    }
}
