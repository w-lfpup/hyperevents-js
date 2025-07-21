export interface HtmlEventParamsInterface {
    sourceEvent: Event;
    html: string;
    target?: Element;
    destination?: Element;
    projection?: string;
}
export interface HtmlEventInterface {
    readonly htmlParams: HtmlEventParamsInterface;
}
export declare function dispatchHtmlEvent(sourceEvent: Event, el: Element, kind: string): void;
