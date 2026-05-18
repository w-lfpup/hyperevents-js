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

	let { element, event } = params;
	let { timeStamp, type } = event;

	elementMap.set(element, { timeStamp, type, abortParams });

	return false;
}

function getThrottleParams(
	dispatchParams: DispatchParams,
): ThrottleParams | undefined {
	let { element, event } = dispatchParams;

	let windowMsAttr = element.getAttribute(`${event.type}:throttle-ms`);
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
	let { element, event } = dispatchParams;
	let { windowMs } = throttleParams;

	let throttler = elementMap.get(element);
	if (throttler) {
		let delta = performance.now() - throttler.timeStamp;
		if (event.type === throttler.type && delta < windowMs) return true;

		throttler.abortParams?.abortController.abort();
	}

	return false;
}
