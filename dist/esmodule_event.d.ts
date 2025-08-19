import type { DispatchParams } from "./type_flyweight.js";
interface EsModuleRequestedInterface {
    status: "requested";
    url: string;
}
interface EsModuleResolvedInterface {
    status: "resolved";
    url: string;
}
interface EsModuleErrorInterface {
    status: "rejected";
    url: string;
    error: any;
}
export type EsModuleRequestState = EsModuleRequestedInterface | EsModuleResolvedInterface | EsModuleErrorInterface;
export interface EsModuleEventInterface {
    requestState: EsModuleRequestState;
}
export declare class EsModuleEvent extends Event implements EsModuleEventInterface {
    requestState: EsModuleRequestState;
    constructor(requestState: EsModuleRequestState, eventInitDict: EventInit);
}
export declare function dispatchEsModuleEvent(params: DispatchParams): void;
export {};
