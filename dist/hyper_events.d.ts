export interface HyperEventsParamsInterface {
	connected?: boolean;
	eventNames: string[];
	host: EventTarget;
	target?: EventTarget;
	infix?: string;
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
