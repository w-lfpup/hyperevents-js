import type { DispatchParams } from "./type_flyweight.js";

interface Debouncer {
	interval: number;
}

let elementMap = new WeakMap<EventTarget, Map<string, number>>();

interface Callback {
	(dispatchParams: DispatchParams): void;
}

export function debounced(params: DispatchParams, cb: Callback) {
	let windowMs = getDebouncedParams(params);
	// 0 or 1 or ??
	if (!windowMs) return false;

	let { type, target, event } = params;

	let debounceMap = elementMap.get(target);
	if (!debounceMap) {
		debounceMap = new Map();
		elementMap.set(target, debounceMap);
	}

	let key = `${event.type}:${type}`;
	let prevInterval = debounceMap.get(key);
	if (prevInterval) window.clearTimeout(prevInterval);

	let interval = window.setTimeout(function () {
		cb(params);
	}, windowMs);

	debounceMap.set(key, interval);
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
