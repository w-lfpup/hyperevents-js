export interface DispatchParams {
	kind: string;
	target: Element;
	event: Event;
	dispatchTarget: EventTarget;
	abortController?: AbortController;
	type?: string;
}

interface RequestParams {
	method: string;
	timeoutMs: number;
	url: string;
}

export interface FetchParamsInterface {
	url: string;
	method: string;
	// request: Request;
}

const FALLBACK_TIMEOUT_MS = 10000;

export function createFetch(
	dispatchParams: DispatchParams,
): Request | undefined {
	let requestParams = getRequestParams(dispatchParams);
	if (!requestParams) return;

	let request = createRequest(dispatchParams, requestParams);

	return request;
}

function getRequestParams(
	dispatchParams: DispatchParams,
): RequestParams | undefined {
	let { target, event } = dispatchParams;
	let { type } = event;

	let url = target.getAttribute(`${type}:url`);
	if (!url) return;

	let method = target.getAttribute(`${type}:method`) ?? "GET";
	let timeoutMsAttr = target.getAttribute(`${type}:timeout-ms`);
	let timeoutMs = parseInt(timeoutMsAttr ?? "");
	if (Number.isNaN(timeoutMs)) timeoutMs = FALLBACK_TIMEOUT_MS;

	return {
		timeoutMs,
		url,
		method,
	};
}

function createRequest(
	dispatchParams: DispatchParams,
	requestParams: RequestParams,
): Request {
	let { url, timeoutMs, method } = requestParams;

	let { abortController, target } = dispatchParams;
	let signals = [AbortSignal.timeout(timeoutMs)];
	if (abortController) signals.push(abortController.signal);
	let signal = AbortSignal.any(signals);

	let formData: FormData | undefined;
	if (target instanceof HTMLFormElement) formData = new FormData(target);

	return new Request(url, {
		body: formData,
		signal,
		method,
	});
}
