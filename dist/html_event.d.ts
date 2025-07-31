import type { DispatchParams, RequestStatus } from "./type_flyweight.js";
export interface HtmlEventParamsInterface {
    response: Response;
    html: string;
    target?: Element;
    destination?: Element;
    projection?: string;
}
export interface HtmlEventInterface {
    readonly htmlParams: HtmlEventParamsInterface;
}
export declare class HtmlEvent extends Event {
    #private;
    constructor(status: RequestStatus, eventInit?: EventInit);
    get status(): RequestStatus;
}
export declare function dispatchHtmlEvent(dispatchParams: DispatchParams): void;
