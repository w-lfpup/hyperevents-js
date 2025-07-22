interface ShouldThrottleParams {
    el: Element;
    currentTarget: Event["currentTarget"];
    kind: string;
    prefix: string;
    action?: ReturnType<Element["getAttribute"]>;
    url?: ReturnType<Element["getAttribute"]>;
}
export declare function shouldThrottle(params: ShouldThrottleParams): boolean;
export declare function setThrottler(params: ShouldThrottleParams, abortController?: AbortController): void;
export {};
