import type { DispatchParams, RequestParams } from "./type_flyweight.js";
interface ThrottleParams {
    prefix: string;
    throttle: string;
    timeoutMs: number;
}
export declare function getThrottleParams(dispatchParams: DispatchParams, prefix: string): ThrottleParams | undefined;
export declare function shouldThrottle(dispatchParams: DispatchParams, requestParams: RequestParams, throttleParams?: ThrottleParams): boolean;
export declare function setThrottler(params: DispatchParams, requestParams: RequestParams, throttleParams?: ThrottleParams, abortController?: AbortController): void;
export {};
