interface HxResponseEventInterface {
	projectionTarget: EventTarget | null;
	projectionStyle: string;
	response: Response;
	template: HTMLTemplateElement;
}

interface HxResponseEventParams {
	projectionTarget: EventTarget | null;
	projectionStyle: string;
	response: Response;
	template: HTMLTemplateElement;
	eventInit?: EventInit;
}

interface HxResponseErrorEventInterface {
	error: unknown;
}

class HxResponseErrorEvent
	extends Event
	implements HxResponseErrorEventInterface
{
	#error: unknown;

	constructor(error: unknown, eventInit?: EventInit) {
		super("#response-error", eventInit);
		this.#error = error;
	}

	get error() {
		return this.#error;
	}
}

class HxResponseEvent extends Event implements HxResponseEventInterface {
	#params: HxResponseEventParams;

	constructor(params: HxResponseEventParams) {
		super("#response", params.eventInit);

		this.#params = params;
	}

	get projectionTarget() {
		return this.#params.projectionTarget;
	}

	get projectionStyle() {
		return this.#params.projectionStyle;
	}

	get response() {
		return this.#params.response;
	}

	get template() {
		return this.#params.template;
	}
}

export type { HxResponseEventInterface };
export { HxResponseEvent, HxResponseErrorEvent };
