import type { DispatchParams } from "./type_flyweight.js";
export interface ActionInterface {
    sourceEvent: Event;
    action: string;
}
export interface ActionEventInterface {
    actionParams: ActionInterface;
}
export declare class ActionEvent extends Event implements ActionEventInterface {
    actionParams: ActionInterface;
    constructor(actionParams: ActionInterface, eventInit?: EventInit);
}
export declare function dispatchActionEvent(dispatchParams: DispatchParams): void;
