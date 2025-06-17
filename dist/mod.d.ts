export interface SuperFetchParamsInterface {
    host: ParentNode;
    eventNames: string[];
    connected?: boolean;
}
export interface SuperFetchInterface {
    connect(): void;
    disconnect(): void;
}
export declare class SuperFetch {
    #private;
    constructor(params: SuperFetchParamsInterface);
    connect(): void;
    disconnect(): void;
}
