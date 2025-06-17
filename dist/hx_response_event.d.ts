interface HxResponseEventInterface {
    projectionTarget: EventTarget | null;
    projectionStyle: string;
    response: Response;
    template: HTMLTemplateElement;
}
interface HxResponseEventParams {
    projectionTarget: EventTarget | null;
    projectionStyle: string;
    response: Response;
    template: HTMLTemplateElement;
    eventInit?: EventInit;
}
interface HxResponseErrorEventInterface {
    error: unknown;
}
declare class HxResponseErrorEvent extends Event implements HxResponseErrorEventInterface {
    #private;
    constructor(error: unknown, eventInit?: EventInit);
    get error(): unknown;
}
declare class HxResponseEvent extends Event implements HxResponseEventInterface {
    #private;
    constructor(params: HxResponseEventParams);
    get projectionTarget(): EventTarget | null;
    get projectionStyle(): string;
    get response(): Response;
    get template(): HTMLTemplateElement;
}
export type { HxResponseEventInterface };
export { HxResponseEvent, HxResponseErrorEvent };
