declare global {
    interface GlobalEventHandlersEventMap {
        ["#action"]: ActionEventInterface;
    }
    interface ElementEventMap {
        ["action"]: ActionEventInterface;
    }
}
import type { DispatchParams, Queueable } from "./type_flyweight.js";
export interface ActionQueuedInterface {
    status: "queued";
    type: string;
    formData?: FormData;
    target: EventTarget;
    event: Event;
}
export interface ActionCompleteInterface {
    status: "resolved";
    type: string;
    formData?: FormData;
    target: EventTarget;
    event: Event;
}
type ActionStatus = ActionQueuedInterface | ActionCompleteInterface;
export interface ActionEventInterface extends Event {
    action: ActionStatus;
}
export declare class ActionEvent extends Event implements ActionEventInterface {
    action: ActionStatus;
    constructor(actionStatus: ActionStatus, eventInit?: EventInit);
}
export declare function composeAction(dispatchParams: DispatchParams): Queueable | undefined;
export {};
