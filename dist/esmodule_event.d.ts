import type { DispatchParams } from "./type_flyweight.js";
interface EsModuleEventErrorStatusInterface {
    status: "rejected";
    url: string;
    error: any;
}
interface EsModuleEventResultsInterface {
    status: "requested" | "resolved";
    url: string;
}
export type EsModuleRequestStatusInterface = EsModuleEventResultsInterface | EsModuleEventErrorStatusInterface;
export interface EsModuleEventInterface {
    requestStatus: EsModuleRequestStatusInterface;
}
export declare class ESModuleEvent extends Event implements EsModuleEventInterface {
    requestStatus: EsModuleRequestStatusInterface;
    constructor(requestStatus: EsModuleRequestStatusInterface, eventInitDict: EventInit);
}
export declare function dispatchModuleImport(params: DispatchParams): void;
export {};
