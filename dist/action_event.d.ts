import type { DispatchParams } from "./type_flyweight.js";
export interface ActionParamsInterface {
    sourceEvent: Event;
    action: string;
}
export interface ActionEventInterface {
    actionParams: ActionParamsInterface;
}
export declare class ActionEvent extends Event implements ActionEventInterface {
    actionParams: ActionParamsInterface;
    constructor(actionParams: ActionParamsInterface, eventInit?: EventInit);
}
export declare function dispatchActionEvent(dispatchParams: DispatchParams): void;
