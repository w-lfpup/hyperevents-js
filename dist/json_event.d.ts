import type { DispatchParams } from "./type_flyweight.js";
interface JsonRequestInterface {
    request: Request;
    action: string;
    abortController: AbortController;
}
interface JsonRequestQueuedInterface extends JsonRequestInterface {
    status: "queued";
    queueTarget: EventTarget;
}
interface JsonRequestRequestedInterface extends JsonRequestInterface {
    status: "requested";
}
interface JsonRequestResolvedInterface extends JsonRequestInterface {
    status: "resolved";
    response: Response;
    json: any;
}
interface JsonRequestRejectedInterface extends JsonRequestInterface {
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
