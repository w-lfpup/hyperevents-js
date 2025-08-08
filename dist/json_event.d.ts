import type { DispatchParams } from "./type_flyweight.js";
interface JsonEventParamsInterface {
    request: Request;
    url: string;
    action: string | null;
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
type JsonEventState = JsonEventRejectedInterface | JsonEventRequestedInterface | JsonEventResolvedInterface;
export interface JsonEventInterface {
    requestState: JsonEventState;
}
export declare class JsonEvent extends Event implements JsonEventInterface {
    requestState: JsonEventState;
    constructor(requestState: JsonEventState, eventInitDict?: EventInit);
}
export declare function dispatchJsonEvent(dispatchParams: DispatchParams): void;
export {};
