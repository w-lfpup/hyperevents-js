import type { DispatchParams } from "./type_flyweight.js";
interface ThrottleParams {
    prefix: string;
    throttle: string;
    timeoutMs: number;
    action?: ReturnType<Element["getAttribute"]>;
    url?: ReturnType<Element["getAttribute"]>;
}
interface GetThrottleParams {
    prefix: string;
    action?: ReturnType<Element["getAttribute"]>;
    url?: ReturnType<Element["getAttribute"]>;
}
export declare function getThrottleParams(dispatchParams: DispatchParams, params: GetThrottleParams): ThrottleParams | undefined;
export declare function setThrottler(params: DispatchParams, throttleParams: ThrottleParams, abortController?: AbortController): void;
export {};
