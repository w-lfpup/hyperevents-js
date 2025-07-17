export interface ActionEventParamsInterface {
    action: string;
}
export interface ActionEventInterface {
    readonly actionParams: ActionEventParamsInterface;
}
export declare class ActionEvent extends Event implements ActionEventInterface {
    #private;
    constructor(params: ActionEventParamsInterface, eventInit?: EventInit);
    get actionParams(): ActionEventParamsInterface;
}
export declare function getActionEvent(el: Element, kind: string): ActionEvent | undefined;
export declare function getFallbackAction(el: Element, action: string | null): ActionEvent | undefined;
