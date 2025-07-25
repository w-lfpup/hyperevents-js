import type { DispatchParams } from "./type_flyweight.js";
export interface QueueNextCallback {
    (el: Element): void;
}
export interface Queuable {
    dispatch(cb: QueueNextCallback): void;
}
export declare function enqueue(el: EventTarget, queueEntry: Queuable): void;
export declare function shouldQueue(dispatchParams: DispatchParams): EventTarget | undefined;
