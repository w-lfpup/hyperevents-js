import { setThrottler } from "./throttle.js";
export class ActionEvent extends Event {
    actionParams;
    constructor(actionParams, eventInit) {
        super("#action", eventInit);
        this.actionParams = actionParams;
    }
}
export function dispatchActionEvent(dispatchParams) {
    let actionParams = getActionParams(dispatchParams);
    if (!actionParams)
        return;
    if (setThrottler(dispatchParams))
        return;
    let { target, composed } = dispatchParams;
    let event = new ActionEvent(actionParams, { bubbles: true, composed });
    target.dispatchEvent(event);
}
function getActionParams(dispatchParams) {
    let { el, kind, sourceEvent } = dispatchParams;
    let { type } = sourceEvent;
    let action = "_action" === kind ? el.getAttribute(`${type}:action`) : kind;
    if (action)
        return { action, sourceEvent };
}
