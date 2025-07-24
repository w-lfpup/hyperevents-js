export interface JsonEventParamsInterface {
    response: Response;
    jsonStr: string;
    action?: string | null;
}
export interface JsonEventInterface {
    readonly jsonParams: JsonEventParamsInterface;
}
export declare class JsonEvent extends Event implements JsonEventInterface {
    #private;
    constructor(params: JsonEventParamsInterface, eventInit?: EventInit);
    get jsonParams(): JsonEventParamsInterface;
}
export declare function dispatchJsonEvent(el: Element, currentTarget: Event["currentTarget"], kind: string): void;
