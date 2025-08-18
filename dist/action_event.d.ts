import type { DispatchParams } from "./type_flyweight.js";
export interface ActionEventParamsInterface {
    sourceEvent: Event;
    action: string;
}
export interface ActionEventInterface {
    actionParams: ActionEventParamsInterface;
}
export declare class ActionEvent extends Event implements ActionEventInterface {
    actionParams: ActionEventParamsInterface;
    constructor(actionParams: ActionEventParamsInterface, eventInit?: EventInit);
}
export declare function dispatchActionEvent(dispatchParams: DispatchParams): void;
