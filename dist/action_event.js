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
    let event = new ActionEvent(actionParams, { bubbles: true });
    dispatchParams.el.dispatchEvent(event);
}
function getActionParams(dispatchParams) {
    let { el, sourceEvent } = dispatchParams;
    let { type } = sourceEvent;
    let action = el.getAttribute(`${type}:`);
    if ("action" === action) {
        action = el.getAttribute(`${type}:action`);
    }
    if (action)
        return { action, sourceEvent };
}
