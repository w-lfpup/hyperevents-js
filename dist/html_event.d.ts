import type { DispatchParams } from "./type_flyweight.js";
interface HtmlEventParamsInterface {
    request: Request;
    action: string;
    abortController: AbortController;
}
interface HtmlEventQueuedInterface extends HtmlEventParamsInterface {
    queueTarget: EventTarget;
    status: "queued";
}
interface HtmlEventRequestedInterface extends HtmlEventParamsInterface {
    status: "requested";
}
interface HtmlEventResolvedInterface extends HtmlEventParamsInterface {
    status: "resolved";
    response: Response;
    html: HTMLTemplateElement;
}
interface HtmlEventRejectedInterface extends HtmlEventParamsInterface {
    status: "rejected";
    error: any;
}
export type HtmlEventState = HtmlEventQueuedInterface | HtmlEventRejectedInterface | HtmlEventRequestedInterface | HtmlEventResolvedInterface;
export interface HtmlEventInterface {
    htmlParams: HtmlEventParamsInterface;
}
export declare class HtmlEvent extends Event {
    requestState: HtmlEventState;
    constructor(requestState: HtmlEventState, eventInit?: EventInit);
}
export declare function dispatchHtmlEvent(dispatchParams: DispatchParams): void;
export {};
