import type { DispatchParams } from "./type_flyweight.js";
export interface QueableAtom {
    dispatchQueueEvent(): void;
    fetch(): Promise<void> | undefined;
}
export declare function queued(dispatchParams: DispatchParams, atom: QueableAtom): boolean;
