export interface JsonEventParamsInterface {
	action: string;
	jsonStr: string;
	sourceEvent: Event;
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

	if (action && url) {
		let req = new Request(url, {});
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
