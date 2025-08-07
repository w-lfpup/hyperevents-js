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
type JsonEventStates = JsonEventRejectedInterface | JsonEventRequestedInterface | JsonEventResolvedInterface;
export interface JsonEventInterface {
    results: JsonEventStates;
}
export declare class JsonEvent extends Event implements JsonEventInterface {
    results: JsonEventStates;
    constructor(results: JsonEventStates, eventInitDict?: EventInit);
}
export declare function dispatchJsonEvent(dispatchParams: DispatchParams): void;
export {};
