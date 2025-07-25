import type { DispatchParams } from "./type_flyweight.js";

interface Throttler {
	abortController?: AbortController;
	timestamp: DOMHighResTimeStamp;
}

interface ThrottleParams {
	prefix: string;
	throttle: string;
	timeoutMs: number;
	action?: ReturnType<Element["getAttribute"]>;
	url?: ReturnType<Element["getAttribute"]>;
}

interface GetThrottleParams {
	prefix: string;
	action?: ReturnType<Element["getAttribute"]>;
	url?: ReturnType<Element["getAttribute"]>;
}

// throttle by _url _action
// Needs to blow up after a certain amount of keys.
let stringMap = new Map<string, Throttler>();

// throttle by _target _currentTarget
let elementMap = new WeakMap<EventTarget, Throttler>();

export function getThrottleParams(
	dispatchParams: DispatchParams,
	params: GetThrottleParams,
): ThrottleParams | undefined {
	let { el, sourceEvent } = dispatchParams;
	let { type } = sourceEvent;

	let throttle = el.getAttribute(`${type}:throttle`);
	let throttleMsAttr = el.getAttribute(`${type}:throttle-ms`) ?? "";
	let timeoutMs = parseInt(throttleMsAttr);

	if (!throttle || Number.isNaN(timeoutMs)) return;

	let throttleParams: ThrottleParams = {
		throttle,
		timeoutMs,
		...params,
	};

	if (shouldThrottle(dispatchParams, throttleParams)) {
		return throttleParams;
	}
}

function shouldThrottle(
	dispatchParams: DispatchParams,
	throttleParams: ThrottleParams,
): boolean {
	let { currentTarget, el } = dispatchParams;
	let { action, prefix, throttle, timeoutMs, url } = throttleParams;

	if ("_target" === throttle) return shouldThrottleByElement(el, timeoutMs);

	if ("_currentTarget" === throttle)
		return shouldThrottleByElement(currentTarget, timeoutMs);

	if (url && "url" === throttle)
		return shouldThrottleByString(`${prefix}:${throttle}:${url}`, timeoutMs);

	if (action && "action" === throttle)
		return shouldThrottleByString(`${prefix}:${throttle}:${action}`, timeoutMs);

	return false;
}

function shouldThrottleByString(action: string, timeoutMs: number): boolean {
	let throttler = stringMap.get(action);
	if (throttler) {
		let delta = performance.now() - throttler.timestamp;
		if (delta < timeoutMs) {
			return true;
		}

		throttler.abortController?.abort();
	}

	return false;
}

function shouldThrottleByElement(
	el: Event["currentTarget"],
	timeoutMs: number,
): boolean {
	if (el) {
		let throttler = elementMap.get(el);
		if (throttler) {
			let delta = performance.now() - throttler.timestamp;
			if (delta < timeoutMs) {
				return true;
			}

			throttler.abortController?.abort();
		}
	}

	return false;
}

export function setThrottler(
	params: DispatchParams,
	throttleParams: ThrottleParams,
	abortController?: AbortController,
) {
	let { el, currentTarget } = params;
	let { throttle } = throttleParams;

	if (throttle) {
		let { url, prefix, action } = throttleParams;
		let timestamp = performance.now();
		let throttler = { timestamp, abortController };

		// throttle by string
		if (url && "url" === throttle)
			stringMap.set(`${prefix}:${throttle}:${url}`, throttler);
		if (action && "action" === throttle)
			stringMap.set(`${prefix}:${throttle}:${action}`, throttler);

		// throttle by element
		if ("_target" === throttle) elementMap.set(el, throttler);
		if (currentTarget && "_currentTarget" === throttle)
			elementMap.set(currentTarget, throttler);
	}
}
