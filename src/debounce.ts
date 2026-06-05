import type { DispatchParams } from "./type_flyweight.js";

interface Debounced {
	interval: number;
}

interface DebounceParams {
	windowMs: number;
}

let elementMap = new WeakMap<EventTarget, Map<string, Debounced>>();

interface Debouncer {
	(dispatchParams: DispatchParams): void;
}

export function debounced(params: DispatchParams, cb: Debouncer) {
	let debouncedParams = getDebouncedParams(params);
	if (!debouncedParams) return false;

	let { type, target, event } = params;

	let debounceMap = elementMap.get(target);
	if (!debounceMap) {
		debounceMap = new Map();
		elementMap.set(target, debounceMap);
	}

	let key = `${event.type}:${type}`;
	let debouncer = debounceMap.get(key);
	if (debouncer) {
		clearTimeout(debouncer.interval);
	}

	let interval = setTimeout(function () {
		cb(params);
	}, debouncedParams.windowMs);

	debounceMap.set(key, {
		interval,
	});
}

function getDebouncedParams(
	dispatchParams: DispatchParams,
): DebounceParams | undefined {
	let { target, event } = dispatchParams;

	let windowMsAttr = target.getAttribute(`${event.type}:debounce-ms`);
	if (null === windowMsAttr) return;

	let windowMs = parseInt(windowMsAttr);
	if (Number.isNaN(windowMs)) return;

	return {
		windowMs,
	};
}
