import type { DispatchParams } from "./type_flyweight.js";

interface AbortParams {
	abortController: AbortController;
}

interface Throttler {
	abortParams?: AbortParams;
	timeStamp: DOMHighResTimeStamp;
}

interface ThrottleParams {
	throttle: string;
	timeoutMs: number;
}

let elementMap = new WeakMap<EventTarget, Throttler>();

function getThrottleParams(
	dispatchParams: DispatchParams,
): ThrottleParams | undefined {
	let { el, sourceEvent } = dispatchParams;
	let { type } = sourceEvent;

	let throttle = el.getAttribute(`${type}:throttle`);
	if (!throttle) return;

	let throttleMsAttr = el.getAttribute(`${type}:throttle-ms`);
	let timeoutMs = parseInt(throttleMsAttr ?? "");
	if (Number.isNaN(timeoutMs)) return;

	return {
		throttle,
		timeoutMs,
	};
}

export function shouldThrottle(
	dispatchParams: DispatchParams,
	throttleParams: ThrottleParams,
): boolean {
	let { target } = dispatchParams;
	let { throttle, timeoutMs } = throttleParams;

	let throttleEl: EventTarget = document;
	if ("_target" === throttle) throttleEl = target;

	let throttler = elementMap.get(throttleEl);
	if (throttler) {
		let delta = performance.now() - throttler.timeStamp;
		if (delta < timeoutMs) return true;

		throttler.abortParams?.abortController.abort();
	}

	return false;
}

export function setThrottler(
	params: DispatchParams,
	abortParams?: AbortParams,
): boolean {
	let throttleParams = getThrottleParams(params);
	if (!throttleParams) return false;

	// should throttle
	if (shouldThrottle(params, throttleParams)) return true;

	let { throttle } = throttleParams;
	let { target, sourceEvent } = params;
	let { timeStamp } = sourceEvent;

	let throttler = { timeStamp, abortParams };

	let throttleEl: EventTarget = document;
	if ("_target" === throttle) throttleEl = target;

	elementMap.set(throttleEl, throttler);

	return false;
}
