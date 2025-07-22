import { shouldThrottle, setThrottler } from "./throttle.js";
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
export function getActionEvent(sourceEvent, currentTarget, el, kind) {
    let action = el.getAttribute(`${kind}:`);
    if ("action" === action) {
        action = el.getAttribute(`${kind}:action`);
    }
    if (action) {
        if (shouldThrottle(el, currentTarget, kind, "action", action))
            return;
        setThrottler(el, currentTarget, kind, "action", action);
        let event = new ActionEvent({ action, sourceEvent }, { bubbles: true });
        el.dispatchEvent(event);
    }
}
