export type { ActionEventInterface, ActionParamsInterface, } from "./action_event.ts";
export type { EsModuleEventInterface, EsModuleRequestState, } from "./esmodule_event.ts";
export type { JsonEventInterface, JsonRequestState } from "./json_event.ts";
export type { HtmlEventInterface, HtmlRequestState } from "./html_event.ts";
export { ActionEvent } from "./action_event.js";
export { EsModuleEvent } from "./esmodule_event.js";
export { JsonEvent } from "./json_event.js";
export { HtmlEvent } from "./html_event.js";
export interface HyperEventsParamsInterface {
    target: EventTarget;
    eventNames: string[];
    connected?: boolean;
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
