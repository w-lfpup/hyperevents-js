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
    let { target, composed } = dispatchParams;
    let event = new ActionEvent(actionParams, { bubbles: true, composed });
    target.dispatchEvent(event);
}
function getActionParams(dispatchParams) {
    let { el, kind, sourceEvent } = dispatchParams;
    let { type } = sourceEvent;
    let action = kind;
    if ("_action" === kind) {
        action = el.getAttribute(`${type}:action`);
    }
    if (action)
        return { action, sourceEvent };
}
