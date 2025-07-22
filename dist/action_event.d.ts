export interface ActionEventParamsInterface {
    sourceEvent: Event;
    action: string;
    target?: Element | null;
}
export interface ActionEventInterface {
    readonly actionParams: ActionEventParamsInterface;
}
export declare class ActionEvent extends Event implements ActionEventInterface {
    #private;
    constructor(params: ActionEventParamsInterface, eventInit?: EventInit);
    get actionParams(): ActionEventParamsInterface;
}
export declare function getActionEvent(sourceEvent: Event, currentTarget: EventTarget | null, el: Element, kind: string): void;
