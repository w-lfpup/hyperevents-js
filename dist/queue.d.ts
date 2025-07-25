import type { DispatchParams } from "./type_flyweight.js";
export interface QueueNextCallback {
    (el: Element): void;
}
export interface Queuable {
    dispatch(cb: QueueNextCallback): void;
}
export interface ShouldQueueParams {
    prefix: string;
    action?: ReturnType<Element["getAttribute"]>;
    url?: ReturnType<Element["getAttribute"]>;
}
export declare function enqueue(el: Element, queueEntry: Queuable): void;
export declare function shouldQueue(dispatchParams: DispatchParams, params: ShouldQueueParams): string | undefined;
