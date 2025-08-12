import type { DispatchParams, RequestStatus } from "./type_flyweight.js";
interface HtmlEventParamsInterface {
    request: Request;
    url: string;
    action: string | null;
    targeted: Element[];
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
export type HtmlEventState = HtmlEventRejectedInterface | HtmlEventRequestedInterface | HtmlEventResolvedInterface;
export interface HtmlEventInterface {
    readonly htmlParams: HtmlEventParamsInterface;
}
export declare class HtmlEvent extends Event {
    #private;
    constructor(requestState: RequestStatus, eventInit?: EventInit);
    get requestState(): RequestStatus;
}
export declare function dispatchHtmlEvent(dispatchParams: DispatchParams): void;
export {};
