export interface HtmlEventParamsInterface {
    html: string;
    target?: Element;
    destination?: Element;
    projection?: string;
}
export interface HtmlEventInterface {
    readonly htmlParams: HtmlEventParamsInterface;
}
export declare function dispatchHtmlEvent(el: Element, currentTarget: Event["currentTarget"], kind: string): void;
