export class ActionEvent extends Event {
    #params;
    constructor(params, eventInit) {
        super("#action", eventInit);
        this.#params = params;
    }
    get actionParams() {
        return this.#params;
    }
}
export function getActionEvent(sourceEvent, el, kind) {
    let action = el.getAttribute(`${kind}:action`);
    if (action)
        return new ActionEvent({ action, sourceEvent }, { bubbles: true });
}
export function getFallbackAction(sourceEvent, el, action) {
    if (action)
        return new ActionEvent({ action, sourceEvent }, { bubbles: true });
}
