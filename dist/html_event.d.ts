import type { DispatchParams, FetchParamsInterface } from "./type_flyweight.js";
interface HtmlRequestQueuedInterface extends FetchParamsInterface {
    status: "queued";
    queueTarget: EventTarget;
}
interface HtmlRequestRequestedInterface extends FetchParamsInterface {
    status: "requested";
}
interface HtmlRequestResolvedInterface extends FetchParamsInterface {
    status: "resolved";
    response: Response;
    html: string;
}
interface HtmlRequestRejectedInterface extends FetchParamsInterface {
    status: "rejected";
    error: any;
}
export type HtmlRequestState = HtmlRequestQueuedInterface | HtmlRequestRejectedInterface | HtmlRequestRequestedInterface | HtmlRequestResolvedInterface;
export interface HtmlEventInterface {
    requestState: HtmlRequestState;
}
export declare class HtmlEvent extends Event implements HtmlEventInterface {
    requestState: HtmlRequestState;
    constructor(requestState: HtmlRequestState, eventInit?: EventInit);
}
export declare function dispatchHtmlEvent(dispatchParams: DispatchParams): void;
export {};
