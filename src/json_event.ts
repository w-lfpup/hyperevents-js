// asynchronous
// queue-able

// AFAIK we can't use an AbortController on a dynamic import
// but we can on a fetch

// could leave a "status=pending|fulfilled|rejected status:code=200|400|500

export interface JsonEventParamsInterface {
	sourceEvent: Event;
	jsonStr: string;
	action: string | null;
	// target?: Element;
	// throttle?: Element;
	// throttle-timeout-ms?: 100;
	// queue?: Element;
	// could leave a "status=pending|fulfilled|rejected status:code=200|400|500
}

export interface JsonEventInterface {
	readonly jsonParams: JsonEventParamsInterface;
}

export class JsonEvent extends Event implements JsonEventInterface {
	#params: JsonEventParamsInterface;

	constructor(params: JsonEventParamsInterface, eventInit?: EventInit) {
		super("#json", eventInit);
		this.#params = params;
	}

	get jsonParams() {
		return this.#params;
	}
}

export function dispatchJsonEvent(
	sourceEvent: Event,
	el: Element,
	kind: string,
) {
	let action = el.getAttribute(`${kind}:action`);
	let url = el.getAttribute(`${kind}:url`);

	if (url) {
		let req = new Request(url, {});
		// import("./some.json", {type: "json"})
		fetch(req)
			.then(function (response: Response) {
				return Promise.all([response, response.text()]);
			})
			.then(function ([res, jsonStr]) {
				let event = new JsonEvent(
					{ action, jsonStr, sourceEvent },
					{ bubbles: true },
				);
				el.dispatchEvent(event);
			})
			.catch(function (reason: any) {
				console.log("#json error!");
			});
	}
}
