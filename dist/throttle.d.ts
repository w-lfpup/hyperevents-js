import type { DispatchParams } from "./type_flyweight.js";
interface ThrottleParams {
    prefix: string;
    action?: ReturnType<Element["getAttribute"]>;
    url?: ReturnType<Element["getAttribute"]>;
    throttle?: ReturnType<Element["getAttribute"]>;
    throttleTimeoutMs?: ReturnType<Element["getAttribute"]>;
}
interface GetThrottleParams {
    prefix: string;
    action?: ReturnType<Element["getAttribute"]>;
    url?: ReturnType<Element["getAttribute"]>;
}
export declare function getThrottleParams(dispatchParams: DispatchParams, params: GetThrottleParams): {
    prefix: string;
    action?: ReturnType<Element["getAttribute"]>;
    url?: ReturnType<Element["getAttribute"]>;
    throttle: string | null;
    throttleTimeoutMs: string | null;
};
export declare function shouldThrottle(dispatchParams: DispatchParams, throttleParams: ThrottleParams): boolean;
export declare function setThrottler(params: DispatchParams, throttleParams: ThrottleParams, abortController?: AbortController): void;
export {};
