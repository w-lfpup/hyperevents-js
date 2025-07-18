export interface ActionEventParamsInterface {
    action: string;
    sourceEvent: Event;
}
export interface ActionEventInterface {
    readonly actionParams: ActionEventParamsInterface;
}
export declare class ActionEvent extends Event implements ActionEventInterface {
    #private;
    constructor(params: ActionEventParamsInterface, eventInit?: EventInit);
    get actionParams(): ActionEventParamsInterface;
}
export declare function getActionEvent(sourceEvent: Event, el: Element, kind: string): void;
export declare function getFallbackAction(sourceEvent: Event, el: Element, action: string | null): void;
