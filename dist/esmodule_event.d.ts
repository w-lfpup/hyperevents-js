import type { DispatchParams, RequestStatus } from "./type_flyweight.js";
export declare class ESModuleEvent extends Event {
    url: string;
    status: RequestStatus;
    constructor(url: string, status: RequestStatus, eventInitDict: EventInit);
}
export declare function dispatchModuleImport(params: DispatchParams): void;
