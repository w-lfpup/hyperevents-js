import type { DispatchParams, RequestStatus } from "./type_flyweight.js";
export interface JsonEventParamsInterface {
    response: Response;
    jsonStr: string;
    action?: string | null;
}
export interface JsonEventInterface {
    readonly jsonParams: JsonEventParamsInterface;
}
export declare class JsonEvent extends Event {
    #private;
    constructor(status: RequestStatus, eventInit?: EventInit);
    get status(): RequestStatus;
}
export declare function dispatchJsonEvent(dispatchParams: DispatchParams): void;
