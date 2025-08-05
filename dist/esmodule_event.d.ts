import type { DispatchParams, RequestStatus } from "./type_flyweight.js";
export interface EsModuleEventResultsInterface {
    url: string;
    status: RequestStatus;
}
export interface EsModuleEventInterface {
    results: EsModuleEventResultsInterface;
}
export declare class ESModuleEvent extends Event implements EsModuleEventInterface {
    results: EsModuleEventResultsInterface;
    constructor(results: EsModuleEventResultsInterface, eventInitDict: EventInit);
}
export declare function dispatchModuleImport(params: DispatchParams): void;
