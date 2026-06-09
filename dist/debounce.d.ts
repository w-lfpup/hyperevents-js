import type { DispatchParams } from "./type_flyweight.js";
interface Callback {
	(dispatchParams: DispatchParams): void;
}
export declare function debounced(
	params: DispatchParams,
	cb: Callback,
): boolean;
export {};
