// asynchronous
// queue-able

// could leave a "status=pending|fulfilled|rejected status:code=200|400|500

// AFAIK we can't use an AbortController on a dynamic import
// but we can on a fetch

import { shouldThrottle, setThrottler } from "./throttle.js";

export interface HtmlEventParamsInterface {
	html: string;
	target?: Element;
	destination?: Element;
	projection?: string;
	// throttle?: Element;	// queue?: Element;
	// timeout-ms?: number;
}

export interface HtmlEventInterface {
	readonly htmlParams: HtmlEventParamsInterface;
}

export function dispatchHtmlEvent(
	el: Element,
	currentTarget: Event["currentTarget"],
	kind: string,
) {
	let url = el.getAttribute(`${kind}:url`);

	if (url) {
		let params = { el, currentTarget, kind, prefix: "json", url };

		if (shouldThrottle(params)) return;

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
			.then(function (response: Response) {
				return Promise.all([response, response.text()]);
			})
			.then(function ([res, htmlStr]) {
				console.log(htmlStr);
			})
			.catch(function (reason: any) {
				console.log("#html error!");
			});
	}
}
