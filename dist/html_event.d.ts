import type { DispatchParams } from "./type_flyweight.js";
interface HtmlEventParamsInterface {
    request: Request;
    action: string;
    abortController: AbortController;
}
interface HtmlEventQueuedInterface extends HtmlEventParamsInterface {
    status: "queued";
    queueTarget: EventTarget;
}
interface HtmlEventRequestedInterface extends HtmlEventParamsInterface {
    status: "requested";
}
interface HtmlEventResolvedInterface extends HtmlEventParamsInterface {
    status: "resolved";
    response: Response;
    html: string;
}
interface HtmlEventRejectedInterface extends HtmlEventParamsInterface {
    status: "rejected";
    error: any;
}
export type HtmlRequestState = HtmlEventQueuedInterface | HtmlEventRejectedInterface | HtmlEventRequestedInterface | HtmlEventResolvedInterface;
export interface HtmlEventInterface {
    htmlParams: HtmlEventParamsInterface;
}
export declare class HtmlEvent extends Event {
    requestState: HtmlRequestState;
    constructor(requestState: HtmlRequestState, eventInit?: EventInit);
}
export declare function dispatchHtmlEvent(dispatchParams: DispatchParams): void;
export {};
