export { ActionEvent } from "./action_event.js";
export { ESModuleEvent } from "./esmodule_event.js";
export { JsonEvent } from "./json_event.js";
export { HtmlEvent } from "./html_event.js";
export interface HyperEventsParamsInterface {
    target: EventTarget;
    connected: boolean | undefined;
    eventNames: string[];
}
export interface HyperEventsInterface {
    connect(): void;
    disconnect(): void;
}
export declare class HyperEvents {
    #private;
    constructor(params: HyperEventsParamsInterface);
    connect(): void;
    disconnect(): void;
}
