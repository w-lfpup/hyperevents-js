interface Params {
	target: Element;
	dispatchTarget: EventTarget;
	event: Event;
}

interface Throttler {
	abortController: AbortController;
	event: Event;
}

// This might need to be in the document
let elementMap = new WeakMap<EventTarget, Throttler>();

interface ThrottleResult {
	throttle: boolean;
	abortController?: AbortController;
}

export function throttled(params: Params): ThrottleResult {
	let abortController: AbortController | undefined = undefined;

	let windowMs = getThrottleParams(params);
	if (!windowMs) return { throttle: false };

	if (shouldThrottle(params, windowMs)) return { throttle: true };

	let { dispatchTarget, event } = params;

	abortController = new AbortController();
	elementMap.set(dispatchTarget, { event, abortController });

	return { throttle: false, abortController };
}

function getThrottleParams(dispatchParams: Params): number | undefined {
	let { target, event } = dispatchParams;

	let windowMsAttr = target.getAttribute(`${event.type}:throttle-ms`);
	if (null === windowMsAttr) return;

	let windowMs = parseInt(windowMsAttr);
	if (!Number.isNaN(windowMs)) return windowMs;
}

function shouldThrottle(dispatchParams: Params, windowMs: number): boolean {
	let { target, event } = dispatchParams;

	let throttler = elementMap.get(target);
	if (throttler) {
		let { event: prevEvent, abortController } = throttler;

		let delta = event.timeStamp - event.timeStamp;
		if (prevEvent.type === event.type && delta < windowMs) return true;

		abortController.abort();
	}

	return false;
}
