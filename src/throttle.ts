import type { DispatchParams } from "./type_flyweight.js";

interface AbortParams {
	abortController: AbortController;
}

interface Throttler {
	abortParams?: AbortParams;
	event: Event;
}

interface ThrottleParams {
	windowMs: number;
}

let elementMap = new WeakMap<EventTarget, Throttler>();

export function throttled(
	params: DispatchParams,
	abortParams?: AbortParams,
): boolean {
	let throttleParams = getThrottleParams(params);
	if (!throttleParams) return false;

	if (shouldThrottle(params, throttleParams)) return true;

	let { dispatchTarget, event } = params;

	elementMap.set(dispatchTarget, { event, abortParams });

	return false;
}

function getThrottleParams(
	dispatchParams: DispatchParams,
): ThrottleParams | undefined {
	let { target, event } = dispatchParams;

	let windowMsAttr = target.getAttribute(`${event.type}:throttle-ms`);
	if (null === windowMsAttr) return;

	let windowMs = parseInt(windowMsAttr);
	if (Number.isNaN(windowMs)) return;

	return {
		windowMs,
	};
}

function shouldThrottle(
	dispatchParams: DispatchParams,
	throttleParams: ThrottleParams,
): boolean {
	let { dispatchTarget, event } = dispatchParams;
	let { windowMs } = throttleParams;

	let throttler = elementMap.get(dispatchTarget);
	if (throttler) {
		let { event, abortParams } = throttler;
		let delta = performance.now() - event.timeStamp;
		if (event.type === event.type && delta < windowMs) return true;

		abortParams?.abortController.abort();
	}

	return false;
}
