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

	let { currentTarget, el } = dispatchParams;
	let { throttle, timeoutMs } = throttleParams;

	let throttleEl = currentTarget;

	if ("_target" === throttle) throttleEl = el;
	if ("_document" === throttle) throttleEl = document;

	return shouldThrottleByElement(throttleEl, timeoutMs);
}

function shouldThrottleByElement(
	el: Event["target"],
	timeoutMs: number,
): boolean {
	if (!el) return false;

	let throttler = elementMap.get(el);
	if (throttler) {
		let delta = performance.now() - throttler.timeStamp;
		if (delta < timeoutMs) {
			return true;
		}

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
	let { el, currentTarget, sourceEvent } = params;
	let { timeStamp } = sourceEvent;

	let throttler = { timeStamp, abortController };

	let throttleEl = currentTarget;
	if ("_target" === throttle) throttleEl = el;
	if ("_document" === throttle) throttleEl = document;

	elementMap.set(throttleEl, throttler);
}
