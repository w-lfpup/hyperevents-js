// asynchronous
// queue-able
import { setThrottler, getThrottleParams } from "./throttle.js";
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
export function dispatchJsonEvent(dispatchParams) {
    let { el, sourceEvent } = dispatchParams;
    let { type } = sourceEvent;
    let action = el.getAttribute(`${type}:action`);
    let url = el.getAttribute(`${type}:url`);
    if (url) {
        let throttleParams = getThrottleParams(dispatchParams, {
            prefix: "json",
            action,
        });
        let abortController = new AbortController();
        if (throttleParams)
            setThrottler(dispatchParams, throttleParams, abortController);
        // if (shouldQueue(params)) {
        // 	let entry = new QueueableJson(params, abortController);
        // 	return enqueue(el, entry);
        // }
        // fetchJson(params, abortController);
    }
}
// class QueueableJson implements Queuable {
// 	#params: ShouldQueueParams;
// 	#abortController: AbortController;
// 	constructor(params: ShouldQueueParams, abortController: AbortController) {
// 		this.#params = params;
// 		this.#abortController = abortController;
// 	}
// 	dispatch(queueNextCallback: QueueNextCallback) {
// 		fetchJson(this.#params, this.#abortController, queueNextCallback);
// 	}
// }
// function fetchJson(
// 	params: ShouldQueueParams,
// 	abortController: AbortController,
// 	queueNextCallback?: QueueNextCallback,
// ) {
// 	if (abortController.signal.aborted) return;
// 	let { url, action } = params;
// 	if (!url) return;
// 	// if timeout add to queue
// 	let req = new Request(url, {
// 		signal: AbortSignal.any([AbortSignal.timeout(500), abortController.signal]),
// 	});
// 	fetch(req)
// 		.then(function (response: Response) {
// 			return Promise.all([response, response.text()]);
// 		})
// 		.then(function ([response, jsonStr]) {
// 			let event = new JsonEvent(
// 				{ response, action, jsonStr },
// 				{ bubbles: true },
// 			);
// 			el.dispatchEvent(event);
// 		})
// 		.catch(function (_reason: any) {
// 			console.log("#json error!");
// 		})
// 		.finally(function () {
// 			if (queueNextCallback) queueNextCallback(el);
// 		});
// }
