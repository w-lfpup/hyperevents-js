import type { DispatchParams } from "./type_flyweight.js";
export interface QueueParamsInterface {
    queueTarget: EventTarget;
}
export interface QueueNextCallback {
    (el: EventTarget): void;
}
export interface QueuableInterface {
    dispatch(cb: QueueNextCallback): void;
}
export declare function enqueue(params: QueueParamsInterface, queueEntry: QueuableInterface): void;
export declare function getQueueParams(dispatchParams: DispatchParams): QueueParamsInterface | undefined;
