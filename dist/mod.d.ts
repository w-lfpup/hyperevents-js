export { ActionEvent } from "./action_event.js";
export { ESModuleEvent } from "./esmodule_event.js";
export { JsonEvent } from "./json_event.js";
export { HtmlEvent } from "./html_event.js";
export interface SuperChunkParamsInterface {
    target: ParentNode;
    eventNames: string[];
    connected?: boolean;
}
export interface SuperChunkInterface {
    connect(): void;
    disconnect(): void;
}
export declare class SuperChunk {
    #private;
    constructor(params: SuperChunkParamsInterface);
    connect(): void;
    disconnect(): void;
}
