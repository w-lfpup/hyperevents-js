import type { DispatchParams } from "./type_flyweight.js";

interface AbortParams {
	abortController: AbortController;
}

interface Debouncer {
	abortParams?: AbortParams;
	interval: number;
	event: Event;
}

interface DebounceParams {
	windowMs: number;
}

let elementMap = new WeakMap<EventTarget, Map<string, Debouncer>>();

// export function throttled(
// 	params: DispatchParams,
// 	abortParams?: AbortParams,
// ): boolean {
// 	let throttleParams = getThrottleParams(params);
// 	if (!throttleParams) return false;

// 	if (shouldThrottle(params, throttleParams)) return true;

// 	let { dispatchTarget, event } = params;

// 	elementMap.set(dispatchTarget, { event, abortParams });

// 	return false;
// }

function debounced(params: DispatchParams, abortParams?: AbortParams) {
	let debouncedParams = getDebouncedParams(params);
	if (!debouncedParams) return false;
}

function getDebouncedParams(
	dispatchParams: DispatchParams,
): DebounceParams | undefined {
	let { target, event } = dispatchParams;

	let windowMsAttr = target.getAttribute(`${event.type}:debounce-ms`);
	if (null === windowMsAttr) return;

	let windowMs = parseInt(windowMsAttr);
	if (Number.isNaN(windowMs)) return;

	return {
		windowMs,
	};
}
