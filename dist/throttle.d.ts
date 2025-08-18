import type { DispatchParams } from "./type_flyweight.js";
interface ThrottleParams {
    throttle: string;
    timeoutMs: number;
}
export declare function getThrottleParams(dispatchParams: DispatchParams): ThrottleParams | undefined;
export declare function shouldThrottle(dispatchParams: DispatchParams, throttleParams?: ThrottleParams): boolean;
export declare function setThrottler(params: DispatchParams, throttleParams: ThrottleParams | undefined, abortController: AbortController): void;
export {};
