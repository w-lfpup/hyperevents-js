import type { DispatchParams } from "./type_flyweight.js";

interface Callback {
	(dispatchParams: DispatchParams): void;
}

export function debounced(params: DispatchParams, cb: Callback): boolean {
	let windowMs = getDebouncedParams(params);
	if (!windowMs) return false;

	let { target, event } = params;

	let debounceMap = window.$hyperevents.debounce.get(target);
	if (!debounceMap) {
		debounceMap = new Map();
		window.$hyperevents.debounce.set(target, debounceMap);
	}

	let prevReceipt = debounceMap.get(event.type);
	if (prevReceipt) window.clearTimeout(prevReceipt);

	let receipt = window.setTimeout(function () {
		cb(params);

		// clean up after
		debounceMap.delete(event.type);
		if (!debounceMap.size) window.$hyperevents.debounce.delete(target);
	}, windowMs);

	debounceMap.set(event.type, receipt);
	return true;
}

function getDebouncedParams(
	dispatchParams: DispatchParams,
): number | undefined {
	let { target, event, infix } = dispatchParams;

	let windowMsAttr = target.getAttribute(`${event.type}${infix}debounce-ms`);
	if (null === windowMsAttr) return;

	let windowMs = parseInt(windowMsAttr);
	if (!Number.isNaN(windowMs)) return windowMs;
}
