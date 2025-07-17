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
export function dispatchJsonEvent(el, kind) {
    let action = el.getAttribute(`${kind}:action`);
    let url = el.getAttribute(`${kind}:url`);
    if (action && url) {
        new Promise(function (res, rej) {
            // chance to create Function Chain with 
            res("{}");
        }).then(function (jsonStr) {
            if ("string" === typeof jsonStr) {
                let event = new JsonEvent({ action, jsonStr }, { bubbles: true });
                el.dispatchEvent(event);
            }
        });
    }
}
