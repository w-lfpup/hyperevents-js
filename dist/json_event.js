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
export function dispatchJsonEvent(sourceEvent, el, kind) {
    let action = el.getAttribute(`${kind}:action`);
    let url = el.getAttribute(`${kind}:url`);
    if (action && url) {
        let req = new Request(url, {});
        fetch(req)
            .then(function (response) {
            return Promise.all([response, response.text()]);
        })
            .then(function ([res, jsonStr]) {
            let event = new JsonEvent({ action, jsonStr, sourceEvent }, { bubbles: true });
            el.dispatchEvent(event);
        })
            .catch(function (reason) {
            console.log("#json error!");
        });
    }
}
