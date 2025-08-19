import type { DispatchParams } from "./type_flyweight.js";
interface HtmlRequestInterface {
    request: Request;
    action: string;
    abortController: AbortController;
}
interface HtmlRequestQueuedInterface extends HtmlRequestInterface {
    status: "queued";
    queueTarget: EventTarget;
}
interface HtmlRequestRequestedInterface extends HtmlRequestInterface {
    status: "requested";
}
interface HtmlRequestResolvedInterface extends HtmlRequestInterface {
    status: "resolved";
    response: Response;
    html: string;
}
interface HtmlRequestRejectedInterface extends HtmlRequestInterface {
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
