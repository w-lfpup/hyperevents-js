import type { DispatchParams, Queueable } from "./type_flyweight.js";
export declare class Queue {
    #private;
    enqueue(atom: Queueable): void;
}
export declare function queued(dispatchParams: DispatchParams, atom: Queueable): boolean;
