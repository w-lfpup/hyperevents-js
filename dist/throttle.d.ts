import type { DispatchParams } from "./type_flyweight.js";
interface ThrottleParams {
    prefix: string;
    throttle: string;
    timeoutMs: number;
}
interface ThrottleRequestParams {
    url?: ReturnType<Element["getAttribute"]>;
    action?: ReturnType<Element["getAttribute"]>;
}
export declare function getThrottleParams(dispatchParams: DispatchParams, prefix: string): ThrottleParams | undefined;
export declare function shouldThrottle(dispatchParams: DispatchParams, requestParams: ThrottleRequestParams, throttleParams?: ThrottleParams): boolean;
export declare function setThrottler(params: DispatchParams, requestParams: ThrottleRequestParams, throttleParams?: ThrottleParams, abortController?: AbortController): void;
export {};
