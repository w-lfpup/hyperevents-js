import { shouldThrottle, setThrottler, getThrottleParams } from "./throttle.js";
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
export function getActionEvent(dispatchParams) {
    let { el, sourceEvent } = dispatchParams;
    let { type } = sourceEvent;
    let action = el.getAttribute(`${type}:`);
    if ("action" === action) {
        action = el.getAttribute(`${type}:action`);
    }
    if (action) {
        let throttleParams = getThrottleParams(dispatchParams, { prefix: "action", action });
        if (shouldThrottle(dispatchParams, throttleParams))
            return;
        setThrottler(dispatchParams, throttleParams);
        let event = new ActionEvent({ action, sourceEvent }, { bubbles: true });
        el.dispatchEvent(event);
    }
}
