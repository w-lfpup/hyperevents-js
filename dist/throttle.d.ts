import type { DispatchParams } from "./type_flyweight.js";
interface ThrottleParams {
    prefix: string;
    throttle: string;
    timeoutMs: number;
}
export interface ThrottleRequestParams {
    url?: ReturnType<Element["getAttribute"]>;
    action?: ReturnType<Element["getAttribute"]>;
}
export declare function getThrottleParams(dispatchParams: DispatchParams, prefix: string): ThrottleParams | undefined;
export declare function shouldThrottle(dispatchParams: DispatchParams, throttleParams?: ThrottleParams): boolean;
export declare function setThrottler(params: DispatchParams, throttleParams?: ThrottleParams, abortController?: AbortController): void;
export {};
