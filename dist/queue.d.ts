export interface QueueNextCallback {
    (el: Element): void;
}
export interface Queuable {
    dispatch(cb: QueueNextCallback): void;
}
export interface ShouldQueueParams {
    el: Element;
    currentTarget: Event["currentTarget"];
    kind: string;
    prefix: string;
    action?: ReturnType<Element["getAttribute"]>;
    url?: ReturnType<Element["getAttribute"]>;
}
export declare function enqueue(el: Element, queueEntry: Queuable): void;
export declare function shouldQueue(params: ShouldQueueParams): string | undefined;
