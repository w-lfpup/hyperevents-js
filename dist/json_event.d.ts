import type { DispatchParams } from "./type_flyweight.js";
interface JsonEventParamsInterface {
    request: Request;
    action: string;
    abortController: AbortController;
}
interface JsonEventQueuedInterface extends JsonEventParamsInterface {
    status: "queued";
    queueTarget: EventTarget;
}
interface JsonEventRequestedInterface extends JsonEventParamsInterface {
    status: "requested";
}
interface JsonEventResolvedInterface extends JsonEventParamsInterface {
    status: "resolved";
    response: Response;
    json: any;
}
interface JsonEventRejectedInterface extends JsonEventParamsInterface {
    status: "rejected";
    error: any;
}
export type JsonRequestState = JsonEventQueuedInterface | JsonEventRequestedInterface | JsonEventResolvedInterface | JsonEventRejectedInterface;
export interface JsonEventInterface {
    requestState: JsonRequestState;
}
export declare class JsonEvent extends Event implements JsonEventInterface {
    requestState: JsonRequestState;
    constructor(requestState: JsonRequestState, eventInitDict?: EventInit);
}
export declare function dispatchJsonEvent(dispatchParams: DispatchParams): void;
export {};
