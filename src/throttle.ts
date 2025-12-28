import type { DispatchParams } from "./type_flyweight.js";

interface Throttler {
	abortController: AbortController;
	timeStamp: DOMHighResTimeStamp;
}

interface ThrottleParams {
	throttle: string;
	timeoutMs: number;
}

let elementMap = new WeakMap<EventTarget, Throttler>();

export function getThrottleParams(
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
	throttleParams?: ThrottleParams,
): boolean {
	if (!throttleParams) return false;

	let { target } = dispatchParams;
	let { throttle, timeoutMs } = throttleParams;

	let throttleEl: EventTarget = document;
	if ("_target" === throttle) throttleEl = target;

	let throttler = elementMap.get(throttleEl);
	if (throttler) {
		let delta = performance.now() - throttler.timeStamp;
		if (delta < timeoutMs) return true;

		throttler.abortController?.abort();
	}

	return false;
}

export function setThrottler(
	params: DispatchParams,
	throttleParams: ThrottleParams | undefined,
	abortController: AbortController,
) {
	if (!throttleParams) return;

	let { throttle } = throttleParams;
	let { el, target, sourceEvent } = params;
	let { timeStamp } = sourceEvent;

	let throttler = { timeStamp, abortController };

	let throttleEl: EventTarget = document;
	// if ("_action" === throttle) throttleEl = el;
	if ("_target" === throttle) throttleEl = target;

	elementMap.set(throttleEl, throttler);
}
