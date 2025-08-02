import type { DispatchParams, RequestStatus } from "./type_flyweight.js";
export interface JsonEventParamsInterface {
    request: Request;
    response?: Response;
    json?: any;
    action?: string | null;
    error?: any;
}
export interface JsonEventInterface {
    readonly jsonParams: JsonEventParamsInterface;
}
export declare class JsonEvent extends Event {
    #private;
    constructor(params: JsonEventParamsInterface | undefined, status: RequestStatus, eventInit?: EventInit);
    get status(): RequestStatus;
    get jsonStr(): any | undefined;
}
export declare function dispatchJsonEvent(dispatchParams: DispatchParams): void;
