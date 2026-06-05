// import type { DispatchParams } from "./type_flyweight.js";

interface Params {
	target: Element;
	dispatchTarget: EventTarget;
	event: Event;
}

interface Throttler {
	abortController: AbortController;
	event: Event;
}

interface ThrottleParams {
	windowMs: number;
}

let elementMap = new WeakMap<EventTarget, Throttler>();

// needs to return. { throttle, abortController }
export function throttled(params: Params): AbortController | undefined {
	let throttleParams = getThrottleParams(params);
	if (!throttleParams) return;

	if (shouldThrottle(params, throttleParams)) return;

	let { dispatchTarget, event } = params;

	let abortController = new AbortController();
	elementMap.set(dispatchTarget, { event, abortController });

	return abortController;
}

function getThrottleParams(dispatchParams: Params): ThrottleParams | undefined {
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
	dispatchParams: Params,
	throttleParams: ThrottleParams,
): boolean {
	let { dispatchTarget, target, event: dispatchEvent } = dispatchParams;
	let { windowMs } = throttleParams;

	let throttler = elementMap.get(target);
	if (!throttler) return false;

	let { event, abortController } = throttler;
	let delta = dispatchEvent.timeStamp - event.timeStamp;
	if (dispatchEvent.type === event.type && delta < windowMs) return true;

	abortController.abort();

	return false;
}

// DISCARDED PATH
// abort controller made because of throttle / debounce

// export function throttled(
// 	params: DispatchParams,
// 	abortParams?: AbortParams,
// ): boolean {
// 	let throttleParams = getThrottleParams(params);
// 	if (!throttleParams) return false;

// 	if (shouldThrottle(params, throttleParams)) return true;

// 	let { dispatchTarget, event } = params;

// 	elementMap.set(dispatchTarget, { event, abortParams });

// 	return false;
// }
