export interface DispatchParams {
	sourceEvent: Event;
	el: Element;
	currentTarget: EventTarget;
	composed: boolean;
	formData?: FormData;
}

export interface RequestParams {
	action: ReturnType<Element["getAttribute"]>;
	url: ReturnType<Element["getAttribute"]>;
	method: ReturnType<Element["getAttribute"]>;
	timeoutMs?: number;
}

export type RequestStatus = "requested" | "resolved" | "rejected";

export function getRequestParams(
	dispatchParams: DispatchParams,
): RequestParams | undefined {
	let { el, sourceEvent } = dispatchParams;
	let { type } = sourceEvent;

	let action = el.getAttribute(`${type}:action`);
	let url = el.getAttribute(`${type}:url`);
	let method = el.getAttribute(`${type}:method`);

	let timeoutAttr = el.getAttribute(`${type}:timeout-ms`);
	let timeoutMs = parseInt(timeoutAttr ?? "0");

	return {
		timeoutMs: Number.isNaN(timeoutMs) ? undefined : timeoutMs,
		action,
		url,
		method,
	};
}

export function createRequest(
	dispatchParams: DispatchParams,
	requestParams: RequestParams,
	abortController: AbortController,
): Request | undefined {
	let { url, timeoutMs, method } = requestParams;
	if (!url) return;

	let abortSignals = [abortController.signal];
	if (timeoutMs) abortSignals.push(AbortSignal.timeout(timeoutMs));

	return new Request(url, {
		signal: AbortSignal.any(abortSignals),
		method: method ?? "GET",
		body: dispatchParams.formData,
	});
}
