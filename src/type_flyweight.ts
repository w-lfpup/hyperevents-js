export interface DispatchParams {
	composed: boolean;
	target: EventTarget;
	el: Element;
	formData?: FormData;
	kind: string;
	sourceEvent: Event;
}

export interface RequestParams {
	action: string;
	method: string;
	timeoutMs?: number;
	url: string;
}

export function getRequestParams(
	dispatchParams: DispatchParams,
): RequestParams | undefined {
	let { el, sourceEvent } = dispatchParams;
	let { type } = sourceEvent;

	let action = el.getAttribute(`${type}:action`);
	if (!action) return;

	let url = el.getAttribute(`${type}:url`);
	if (!url) return;

	let method = el.getAttribute(`${type}:method`) ?? "GET";
	let timeoutAttr = el.getAttribute(`${type}:timeout-ms`);
	let timeoutMs = parseInt(timeoutAttr || "");

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

	let abortSignals = [abortController.signal];
	if (timeoutMs) abortSignals.push(AbortSignal.timeout(timeoutMs));

	return new Request(url, {
		signal: AbortSignal.any(abortSignals),
		method: method,
		body: dispatchParams.formData,
	});
}
