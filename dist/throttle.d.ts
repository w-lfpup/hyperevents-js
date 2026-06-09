interface Params {
    target: Element;
    dispatchTarget: EventTarget;
    event: Event;
    infix: string;
}
export interface Throttler {
    abortController: AbortController;
    event: Event;
}
interface ThrottleResult {
    throttle: boolean;
    abortController?: AbortController;
}
export declare function throttled(params: Params): ThrottleResult;
export {};
