// asynchronous
// queue-able

// could leave a "status=pending|fulfilled|rejected status:code=200|400|500

// AFAIK we can't use an AbortController on a dynamic import
// but we can on a fetch

export interface HtmlEventParamsInterface {
	sourceEvent: Event;
	html: string;
	target?: Element;
	destination?: Element;
	projection?: string;
	// throttle?: Element;
	// queue?: Element;
	// timeout-ms?: number;
}

export interface HtmlEventInterface {
	readonly htmlParams: HtmlEventParamsInterface;
}

export function dispatchHtmlEvent(
	sourceEvent: Event,
	el: Element,
	kind: string,
) {
	let url = el.getAttribute(`${kind}:url`);

	if (url) {
		let req = new Request(url, {});
		fetch(req)
			.then(function (response: Response) {
				return Promise.all([response, response.text()]);
			})
			.then(function ([res, htmlStr]) {
				console.log(htmlStr);
			})
			.catch(function (reason: any) {
				console.log("#json error!");
			});
	}
}
