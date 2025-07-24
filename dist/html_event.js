// asynchronous
// queue-able
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
export function dispatchHtmlEvent(dispatchParams) {
    let { el, sourceEvent } = dispatchParams;
    let { type } = sourceEvent;
    let url = el.getAttribute(`${type}:url`);
    if (url) {
        // let params = { prefix: "html", el, currentTarget, type, url };
        // if (shouldThrottle(params)) return;
        // let abortController = new AbortController();
        // setThrottler(params, abortController);
        // if (shouldQueue(params)) {
        // 	let entry = new QueueableHtml(params, abortController);
        // 	return enqueue(el, entry);
        // 	// enqueue(el, getQueuable(params, abortController));
        // }
        // fetchHtml(params, abortController);
    }
}
class QueueableHtml {
    #params;
    #abortController;
    constructor(params, abortController) {
        this.#params = params;
        this.#abortController = abortController;
    }
    dispatch(queueNextCallback) {
        fetchHtml(this.#params, this.#abortController, queueNextCallback);
    }
}
function fetchHtml(params, abortController, queueNextCallback) {
    if (abortController.signal.aborted)
        return;
    let { url, action, el } = params;
    if (!url)
        return;
    // if timeout add to queue
    let req = new Request(url, {
        signal: AbortSignal.any([AbortSignal.timeout(500), abortController.signal]),
    });
    fetch(req)
        .then(function (response) {
        return Promise.all([response, response.text()]);
    })
        .then(function ([response, html]) {
        let event = new HtmlEvent({ response, html }, { bubbles: true });
        el.dispatchEvent(event);
    })
        .catch(function () {
        console.log("#html error!");
    })
        .finally(function () {
        if (queueNextCallback)
            queueNextCallback(el);
    });
}
