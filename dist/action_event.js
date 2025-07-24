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
        let params = {
            prefix: "action",
            el,
            currentTarget,
            kind,
            action,
        };
        if (shouldThrottle(params))
            return;
        setThrottler(params);
        let event = new ActionEvent({ action, sourceEvent }, { bubbles: true });
        el.dispatchEvent(event);
    }
}
