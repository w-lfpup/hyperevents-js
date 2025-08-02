import type { DispatchParams, RequestParams } from "./type_flyweight.js";

interface Throttler {
	abortController?: AbortController;
	timestamp: DOMHighResTimeStamp;
}

interface ThrottleParams {
	prefix: string;
	throttle: string;
	timeoutMs: number;
}

// Needs to blow up after a certain amount of keys.
let stringMap = new Map<string, Throttler>();
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
	requestParams: RequestParams,
	throttleParams?: ThrottleParams,
): boolean {
	if (!throttleParams) return false;

	let { currentTarget, el } = dispatchParams;
	let { action, url } = requestParams;
	let { prefix, throttle, timeoutMs } = throttleParams;

	if ("_target" === throttle) return shouldThrottleByElement(el, timeoutMs);

	if ("_currentTarget" === throttle)
		return shouldThrottleByElement(currentTarget, timeoutMs);

	if ("_action" === throttle && action)
		return shouldThrottleByString(getKey(prefix, throttle, action), timeoutMs);

	if ("_url" === throttle && url)
		return shouldThrottleByString(getKey(prefix, throttle, url), timeoutMs);

	return false;
}

function getKey(prefix: string, throttle: string, kind: string) {
	return `${prefix}:${throttle}:${kind}`;
}

function shouldThrottleByString(action: string, timeoutMs: number): boolean {
	let throttler = stringMap.get(action);
	return compareThrottler(throttler, timeoutMs);
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
		let delta = performance.now() - throttler.timestamp;
		if (delta < timeoutMs) {
			return true;
		}

		throttler.abortController?.abort();
	}

	return false;
}

export function setThrottler(
	params: DispatchParams,
	requestParams: RequestParams,
	throttleParams?: ThrottleParams,
	abortController?: AbortController,
) {
	if (!throttleParams) return;

	let { throttle, prefix } = throttleParams;

	if (throttle) {
		let { el, currentTarget } = params;
		let { url, action } = requestParams;

		let timestamp = performance.now();
		let throttler = { timestamp, abortController };

		// throttle by element
		if ("_target" === throttle) elementMap.set(el, throttler);
		if ("_currentTarget" === throttle && currentTarget)
			elementMap.set(currentTarget, throttler);

		// throttle by string
		if ("_action" === throttle && action)
			stringMap.set(getKey(prefix, throttle, action), throttler);
		if ("_url" === throttle && url)
			stringMap.set(getKey(prefix, throttle, url), throttler);
	}
}
