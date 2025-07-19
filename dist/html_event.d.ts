export interface HtmlEventParamsInterface {
    sourceEvent: Event;
}
export interface HtmlEventInterface {
    readonly htmlParams: HtmlEventParamsInterface;
}
export declare function dispatchHtmlEvent(sourceEvent: Event, el: Element, kind: string): void;
