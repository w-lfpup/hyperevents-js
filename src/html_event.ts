export interface HtmlEventParamsInterface {
	sourceEvent: Event;
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
