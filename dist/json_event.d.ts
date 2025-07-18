export interface JsonEventParamsInterface {
    action: string;
    jsonStr: string;
    sourceEvent: Event;
}
export interface JsonEventInterface {
    readonly jsonParams: JsonEventParamsInterface;
}
export declare class JsonEvent extends Event implements JsonEventInterface {
    #private;
    constructor(params: JsonEventParamsInterface, eventInit?: EventInit);
    get jsonParams(): JsonEventParamsInterface;
}
export declare function dispatchJsonEvent(sourceEvent: Event, el: Element, kind: string): void;
