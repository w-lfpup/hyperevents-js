import type { DispatchParams } from "./type_flyweight.js";
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
export declare class HtmlEvent extends Event implements HtmlEventInterface {
    #private;
    constructor(params: HtmlEventParamsInterface, eventInit?: EventInit);
    get htmlParams(): HtmlEventParamsInterface;
}
export declare function dispatchHtmlEvent(dispatchParams: DispatchParams): void;
