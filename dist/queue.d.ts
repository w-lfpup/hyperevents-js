import type { DispatchParams } from "./type_flyweight.js";
export interface QueueParamsInterface {
    queueTarget: EventTarget;
}
export interface QueueNextCallback {
    (el: EventTarget): void;
}
export interface QueuableInterface {
    dispatch(): void;
}
interface QueuableParams<A> {
    fetchParams: A;
    fetchCallback: Function;
    dispatchParams: DispatchParams;
    queueParams: QueueParamsInterface;
    abortController: AbortController;
}
export declare class Queueable<A> implements QueuableInterface {
    #private;
    constructor(params: QueuableParams<A>);
    dispatch(): void;
}
export declare function enqueue(params: QueueParamsInterface, queueEntry: QueuableInterface): void;
export declare function getQueueParams(dispatchParams: DispatchParams): QueueParamsInterface | undefined;
export {};
