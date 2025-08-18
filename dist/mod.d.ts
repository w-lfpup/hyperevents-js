export { ActionEvent } from "./action_event.js";
export { ESModuleEvent } from "./esmodule_event.js";
export { JsonEvent } from "./json_event.js";
export { HtmlEvent } from "./html_event.js";
export interface HyperActionsParamsInterface {
    target: EventTarget;
    connected: boolean | undefined;
    eventNames: string[];
}
export interface HyperActionsInterface {
    connect(): void;
    disconnect(): void;
}
export declare class HyperActions {
    #private;
    constructor(params: HyperActionsParamsInterface);
    connect(): void;
    disconnect(): void;
}
