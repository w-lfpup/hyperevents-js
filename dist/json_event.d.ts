import type { DispatchParams } from "./type_flyweight.js";
interface JsonEventParamsInterface {
    request: Request;
    action: string | null;
}
interface JsonEventThrottledInterface extends JsonEventParamsInterface {
    queueTarget: EventTarget;
    status: "throttled";
}
interface JsonEventQueuedInterface extends JsonEventParamsInterface {
    queueTarget: EventTarget;
    status: "queued";
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
type JsonEventState = JsonEventThrottledInterface | JsonEventQueuedInterface | JsonEventRequestedInterface | JsonEventResolvedInterface | JsonEventRejectedInterface;
export interface JsonEventInterface {
    requestState: JsonEventState;
}
export declare class JsonEvent extends Event implements JsonEventInterface {
    requestState: JsonEventState;
    constructor(requestState: JsonEventState, eventInitDict?: EventInit);
}
export declare function dispatchJsonEvent(dispatchParams: DispatchParams): void;
export {};
