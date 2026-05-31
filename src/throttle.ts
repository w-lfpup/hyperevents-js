import type { DispatchParams } from "./type_flyweight.js";

interface AbortParams {
	abortController: AbortController;
}

interface Throttler {
	abortParams?: AbortParams;
	type: string;
	timeStamp: DOMHighResTimeStamp;
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
	let { timeStamp, type } = event;

	// same event:action ? like click:

	elementMap.set(dispatchTarget, { timeStamp, type, abortParams });

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
		let delta = performance.now() - throttler.timeStamp;
		if (event.type === throttler.type && delta < windowMs) return true;

		throttler.abortParams?.abortController.abort();
	}

	return false;
}
