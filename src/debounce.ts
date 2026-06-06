import type { DispatchParams } from "./type_flyweight.js";

interface Callback {
	(dispatchParams: DispatchParams): void;
}

let elementMap = new WeakMap<EventTarget, Map<string, number>>();

export function debounced(params: DispatchParams, cb: Callback) {
	let windowMs = getDebouncedParams(params);
	if (!windowMs) return false;

	let { target, event } = params;

	let debounceMap = elementMap.get(target);
	if (!debounceMap) {
		debounceMap = new Map();
		elementMap.set(target, debounceMap);
	}

	let prevReceipt = debounceMap.get(event.type);
	if (prevReceipt) window.clearTimeout(prevReceipt);

	let receipt = window.setTimeout(function () {
		cb(params);

		// clean up after
		debounceMap.delete(event.type);
		if (!debounceMap.size) elementMap.delete(target);
	}, windowMs);

	debounceMap.set(event.type, receipt);
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
