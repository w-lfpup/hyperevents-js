import type { DispatchParams } from "./type_flyweight.js";

interface Throttled {
	abortController?: AbortController;
	timestamp: DOMHighResTimeStamp;
}

// throttle by _url _action
// Needs to blow up after a certain amount of keys.
let stringMap = new Map<string, Throttled>();

// throttle by _target _currentTarget
let elementMap = new WeakMap<EventTarget, Throttled>();

// two functions throttle

interface ThrottleParams {
	prefix: string;
	action?: ReturnType<Element["getAttribute"]>;
	url?: ReturnType<Element["getAttribute"]>;
	throttle?: ReturnType<Element["getAttribute"]>;
	throttleTimeoutMs?: ReturnType<Element["getAttribute"]>;
}

interface GetThrottleParams {
	prefix: string;
	action?: ReturnType<Element["getAttribute"]>;
	url?: ReturnType<Element["getAttribute"]>;
}

export function getThrottleParams(
	dispatchParams: DispatchParams,
	params: GetThrottleParams,
) {
	let { el, sourceEvent } = dispatchParams;
	let { type } = sourceEvent;

	return {
		throttle: el.getAttribute(`${type}:throttle`),
		throttleTimeoutMs: el.getAttribute(`${type}:throttle-ms`),
		...params,
	};
}

export function shouldThrottle(
	dispatchParams: DispatchParams,
	throttleParams: ThrottleParams,
): boolean {
	let { el } = dispatchParams;

	let { throttle, throttleTimeoutMs } = throttleParams;
	if (throttle && throttleTimeoutMs) {
		let timeoutMs = parseInt(throttleTimeoutMs ?? "");

		if (!Number.isNaN(timeoutMs)) {
			// throttle by string
			let { currentTarget } = dispatchParams;
			let { url, prefix, action } = throttleParams;

			if (url && "url" === throttle)
				return shouldThrottleByString(
					timeoutMs,
					`${prefix}:${throttle}:${url}`,
				);

			if (action && "action" === throttle)
				return shouldThrottleByString(
					timeoutMs,
					`${prefix}:${throttle}:${action}`,
				);

			// throttle by element
			if ("target" === throttle) return shouldThrottleByElement(el, timeoutMs);

			if ("currentTarget" === throttle)
				return shouldThrottleByElement(currentTarget, timeoutMs);
		}
	}

	return false;
}

function shouldThrottleByString(timeoutMs: number, action: string): boolean {
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
	let { el, sourceEvent, currentTarget } = params;

	let throttle = el.getAttribute(`${sourceEvent.type}}:throttle`);
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
		if ("target" === throttle) elementMap.set(el, throttler);
		if (currentTarget && "currentTarget" === throttle)
			elementMap.set(currentTarget, throttler);
	}
}
