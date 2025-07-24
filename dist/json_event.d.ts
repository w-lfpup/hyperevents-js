import type { DispatchParams } from "./type_flyweight.js";
export interface JsonEventParamsInterface {
    response: Response;
    jsonStr: string;
    action?: string | null;
}
export interface JsonEventInterface {
    readonly jsonParams: JsonEventParamsInterface;
}
export declare class JsonEvent extends Event implements JsonEventInterface {
    #private;
    constructor(params: JsonEventParamsInterface, eventInit?: EventInit);
    get jsonParams(): JsonEventParamsInterface;
}
export declare function dispatchJsonEvent(dispatchParams: DispatchParams): void;
