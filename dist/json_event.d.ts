import type { DispatchParams, RequestStatus } from "./type_flyweight.js";
export interface JsonEventParamsInterface {
    status: RequestStatus;
    request: Request;
    action: string | null;
    response?: Response;
    json?: any;
    error?: any;
}
export interface EsModuleEventInterface {
    results: JsonEventParamsInterface;
}
export declare class JsonEvent extends Event implements EsModuleEventInterface {
    results: JsonEventParamsInterface;
    constructor(results: JsonEventParamsInterface, eventInit?: EventInit);
}
export declare function dispatchJsonEvent(dispatchParams: DispatchParams): void;
