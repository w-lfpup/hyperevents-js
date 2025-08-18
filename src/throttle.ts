import type { DispatchParams } from "./type_flyweight.js";

interface Throttler {
	abortController?: AbortController;
	timeStamp: DOMHighResTimeStamp;
}

interface ThrottleParams {
	prefix: string;
	throttle: string;
	timeoutMs: number;
}

let elementMap = new WeakMap<EventTarget, Throttler>();

export function getThrottleParams(
	dispatchParams: DispatchParams,
	prefix: string,
): ThrottleParams | undefined {
	let { el, sourceEvent } = dispatchParams;
	let { type } = sourceEvent;

	let throttle = el.getAttribute(`${type}:throttle`);
	if (!throttle) return;

	let throttleMsAttr = el.getAttribute(`${type}:throttle-ms`);
	let timeoutMs = parseInt(throttleMsAttr ?? "");

	if (Number.isNaN(timeoutMs)) return;

	return {
		prefix,
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
	let { prefix, throttle, timeoutMs } = throttleParams;

	if ("_target" === throttle) return shouldThrottleByElement(el, timeoutMs);

	if ("_currentTarget" === throttle)
		return shouldThrottleByElement(currentTarget, timeoutMs);

	if ("_document" === throttle)
		return shouldThrottleByElement(document, timeoutMs);

	return false;
}

function shouldThrottleByElement(
	el: Event["target"],
	timeoutMs: number,
): boolean {
	if (!el) return false;

	let throttler = elementMap.get(el);

	return compareThrottler(throttler, timeoutMs);
}

function compareThrottler(throttler: Throttler | undefined, timeoutMs: number) {
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
	throttleParams?: ThrottleParams,
	abortController?: AbortController,
) {
	if (!throttleParams) return;

	let { throttle, prefix } = throttleParams;

	let { el, currentTarget, sourceEvent } = params;
	let { timeStamp } = sourceEvent;

	let throttler = { timeStamp, abortController };

	let throttleEl = currentTarget;
	if ("_target" === throttle) throttleEl = el;
	if ("_document" === throttle) throttleEl = document;

	if ("html" === prefix) elementMap.set(throttleEl, throttler);
	if ("json" === prefix) elementMap.set(throttleEl, throttler);
}
