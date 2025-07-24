import type { DispatchParams } from "./type_flyweight.js";
interface ShouldThrottleParams {
    prefix: string;
    action?: ReturnType<Element["getAttribute"]>;
    url?: ReturnType<Element["getAttribute"]>;
    throttle?: ReturnType<Element["getAttribute"]>;
    thottleTimeoutMs?: ReturnType<Element["getAttribute"]>;
}
export declare function getThrottleParams(dispatchParams: DispatchParams, prefix: string, action: string): {
    throttle: string | null;
    throttleTimeoutMs: string | null;
    action: string;
    prefix: string;
};
export declare function shouldThrottle(dispatchParams: DispatchParams, throttleParams: ShouldThrottleParams): boolean;
export declare function setThrottler(params: DispatchParams, throttleParams: ShouldThrottleParams, abortController?: AbortController): void;
export {};
