import type { DispatchParams } from "./type_flyweight.js";
export interface ActionEventParamsInterface {
    sourceEvent: Event;
    action: string;
    formData?: FormData;
}
export interface ActionEventInterface {
    readonly actionParams: ActionEventParamsInterface;
}
export declare class ActionEvent extends Event implements ActionEventInterface {
    #private;
    constructor(params: ActionEventParamsInterface, eventInit?: EventInit);
    get actionParams(): ActionEventParamsInterface;
}
export declare function dispatchActionEvent(dispatchParams: DispatchParams): void;
