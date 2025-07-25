import type { DispatchParams, RequestParams } from "./type_flyweight.js";
interface ThrottleParams {
    prefix: string;
    throttle: string;
    timeoutMs: number;
}
export declare function getThrottleParams(dispatchParams: DispatchParams, requestParams: RequestParams, prefix: string): ThrottleParams | undefined;
export declare function setThrottler(params: DispatchParams, requestParams: RequestParams, throttleParams: ThrottleParams, abortController?: AbortController): void;
export {};
