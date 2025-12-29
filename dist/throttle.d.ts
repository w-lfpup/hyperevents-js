import type { DispatchParams } from "./type_flyweight.js";
interface AbortParams {
    abortController: AbortController;
}
interface ThrottleParams {
    throttle: string;
    timeoutMs: number;
}
export declare function shouldThrottle(dispatchParams: DispatchParams, throttleParams: ThrottleParams): boolean;
export declare function setThrottler(params: DispatchParams, abortParams?: AbortParams): boolean;
export {};
