import type { DispatchParams } from "./type_flyweight.js";
export interface QueueParamsInterface {
    queueTarget: Element;
}
export interface QueueNextCallback {
    (el: Element): void;
}
export interface Queuable {
    dispatch(cb: QueueNextCallback): void;
}
export declare function enqueue(params: QueueParamsInterface, queueEntry: Queuable): void;
export declare function getQueueParams(dispatchParams: DispatchParams): QueueParamsInterface | undefined;
