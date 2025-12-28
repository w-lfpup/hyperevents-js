import type { DispatchParams, FetchParamsInterface } from "./type_flyweight.js";
interface JsonRequestQueuedInterface extends FetchParamsInterface {
    status: "queued";
    queueTarget: EventTarget;
}
interface JsonRequestRequestedInterface extends FetchParamsInterface {
    status: "requested";
}
interface JsonRequestResolvedInterface extends FetchParamsInterface {
    status: "resolved";
    response: Response;
    json: any;
}
interface JsonRequestRejectedInterface extends FetchParamsInterface {
    status: "rejected";
    error: any;
}
export type JsonRequestState = JsonRequestQueuedInterface | JsonRequestRequestedInterface | JsonRequestResolvedInterface | JsonRequestRejectedInterface;
export interface JsonEventInterface {
    requestState: JsonRequestState;
}
export declare class JsonEvent extends Event implements JsonEventInterface {
    requestState: JsonRequestState;
    constructor(requestState: JsonRequestState, eventInitDict?: EventInit);
}
export declare function dispatchJsonEvent(dispatchParams: DispatchParams): void;
export {};
