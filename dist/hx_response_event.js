class HxResponseErrorEvent extends Event {
    #error;
    constructor(error, eventInit) {
        super("#response-error", eventInit);
        this.#error = error;
    }
    get error() {
        return this.#error;
    }
}
class HxResponseEvent extends Event {
    #params;
    constructor(params) {
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
export { HxResponseEvent, HxResponseErrorEvent };
