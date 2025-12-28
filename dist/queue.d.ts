import type { DispatchParams } from "./type_flyweight.js";
export interface QueueParamsInterface {
    queueTarget: EventTarget;
}
export interface QueuableInterface {
    dispatch(): void;
}
export interface FetchCallback<A> {
    (fetchParams: A, dispatchParams: DispatchParams): Promise<void> | undefined;
}
interface QueuableParams<A> {
    dispatchParams: DispatchParams;
    fetchCallback: FetchCallback<A>;
    fetchParams: A;
    queueParams: QueueParamsInterface;
}
export declare class Queueable<A> implements QueuableInterface {
    #private;
    constructor(params: QueuableParams<A>);
    dispatch(): void;
}
export declare function getQueueParams(dispatchParams: DispatchParams): QueueParamsInterface | undefined;
export declare function enqueue<A>(params: QueuableParams<A>): void;
export {};
