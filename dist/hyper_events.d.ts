export interface HyperEventsParamsInterface {
    target: EventTarget;
    eventNames: string[];
    connected?: boolean;
}
export interface HyperEventsInterface {
    connect(): void;
    disconnect(): void;
}
export declare class HyperEvents {
    #private;
    constructor(params: HyperEventsParamsInterface);
    connect(): void;
    disconnect(): void;
}
