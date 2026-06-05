import type { DispatchParams } from "./type_flyweight.js";

let elementMap = new WeakMap<EventTarget, Map<string, number>>();

interface Callback {
	(dispatchParams: DispatchParams): void;
}

export function debounced(params: DispatchParams, cb: Callback) {
	let windowMs = getDebouncedParams(params);
	if (!windowMs) return false;

	let { target, event } = params;

	let debounceMap = elementMap.get(target);
	if (!debounceMap) {
		debounceMap = new Map();
		elementMap.set(target, debounceMap);
	}

	let prevInterval = debounceMap.get(event.type);
	if (prevInterval) window.clearTimeout(prevInterval);

	let interval = window.setTimeout(function () {
		cb(params);

		// clean up after
		debounceMap.delete(event.type);
		if (!debounceMap.size) elementMap.delete(target);
	}, windowMs);

	debounceMap.set(event.type, interval);
}

function getDebouncedParams(
	dispatchParams: DispatchParams,
): number | undefined {
	let { target, event } = dispatchParams;

	let windowMsAttr = target.getAttribute(`${event.type}:debounce-ms`);
	if (null === windowMsAttr) return;

	let windowMs = parseInt(windowMsAttr);
	if (!Number.isNaN(windowMs)) return windowMs;
}
