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

	let { originElement, originEvent } = params;
	let { timeStamp, type } = originEvent;

	elementMap.set(originElement, { timeStamp, type, abortParams });

	return false;
}

function getThrottleParams(
	dispatchParams: DispatchParams,
): ThrottleParams | undefined {
	let { originElement, originEvent } = dispatchParams;
	let { type } = originEvent;

	let windowMsAttr = originElement.getAttribute(`${type}:throttle-ms`);
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
	let { originElement, originEvent } = dispatchParams;
	let { windowMs } = throttleParams;

	let throttler = elementMap.get(originElement);
	if (throttler) {
		let delta = performance.now() - throttler.timeStamp;
		if (originEvent.type === throttler.type && delta < windowMs) return true;

		throttler.abortParams?.abortController.abort();
	}

	return false;
}
