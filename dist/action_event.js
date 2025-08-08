import { getThrottleParams, setThrottler, shouldThrottle } from "./throttle.js";
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
export function dispatchActionEvent(dispatchParams) {
    let actionParams = getActionParams(dispatchParams);
    if (actionParams) {
        let throttleParams = getThrottleParams(dispatchParams, "action");
        if (shouldThrottle(dispatchParams, actionParams, throttleParams))
            return;
        let abortController = undefined;
        if (throttleParams)
            abortController = new AbortController();
        setThrottler(dispatchParams, actionParams, throttleParams, abortController);
        let event = new ActionEvent(actionParams, { bubbles: true });
        dispatchParams.el.dispatchEvent(event);
    }
}
function getActionParams(dispatchParams) {
    let { el, sourceEvent, formData } = dispatchParams;
    let { type } = sourceEvent;
    let action = el.getAttribute(`${type}:`);
    if ("action" === action) {
        action = el.getAttribute(`${type}:action`);
    }
    if (action)
        return { action, sourceEvent, formData };
}
