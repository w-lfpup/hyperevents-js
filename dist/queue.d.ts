import type { DispatchParams } from "./type_flyweight.js";
export interface QueueParamsInterface {
    queueTarget: EventTarget;
}
export interface QueuableInterface {
    dispatch(): void;
}
export interface FetchCallback<A> {
    (dispatchParams: DispatchParams, abortController: AbortController, fetchParams: A): Promise<void> | undefined;
}
interface QueuableParams<A> {
    dispatchParams: DispatchParams;
    queueParams: QueueParamsInterface;
    abortController: AbortController;
    fetchParams: A;
    fetchCallback: FetchCallback<A>;
}
export declare class Queueable<A> implements QueuableInterface {
    #private;
    constructor(params: QueuableParams<A>);
    dispatch(): void;
}
export declare function getQueueParams(dispatchParams: DispatchParams): QueueParamsInterface | undefined;
export declare function enqueue(params: QueueParamsInterface, queueEntry: QueuableInterface): void;
export {};
