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
    params: JsonEventParamsInterface;
    constructor(params: JsonEventParamsInterface, eventInit?: EventInit);
    get results(): JsonEventParamsInterface;
}
export declare function dispatchJsonEvent(dispatchParams: DispatchParams): void;
