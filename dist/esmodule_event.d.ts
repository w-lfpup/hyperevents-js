import type { DispatchParams } from "./type_flyweight.js";
interface EsModuleEventRequestedInterface {
    status: "requested";
    url: string;
}
interface EsModuleEventResolvedInterface {
    status: "resolved";
    url: string;
}
interface EsModuleEventErrorStateInterface {
    status: "rejected";
    url: string;
    error: any;
}
export type EsModuleRequestState = EsModuleEventRequestedInterface | EsModuleEventResolvedInterface | EsModuleEventErrorStateInterface;
export interface EsModuleEventInterface {
    requestState: EsModuleRequestState;
}
export declare class ESModuleEvent extends Event implements EsModuleEventInterface {
    requestState: EsModuleRequestState;
    constructor(requestState: EsModuleRequestState, eventInitDict: EventInit);
}
export declare function dispatchModuleImport(params: DispatchParams): void;
export {};
