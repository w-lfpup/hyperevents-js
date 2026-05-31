export interface DispatchParams {
	formData?: FormData;
	kind: string;
	target: Element;
	event: Event;
	dispatchTarget: EventTarget;
	type?: string;
}

interface RequestParams {
	method: string;
	timeoutMs: number;
	url: string;
}

export interface FetchParamsInterface {
	abortController: AbortController;
	request: Request;
}

const FALLBACK_TIMEOUT_MS = 10000;

export function createFetchParams(
	dispatchParams: DispatchParams,
): FetchParamsInterface | undefined {
	let requestParams = getRequestParams(dispatchParams);
	if (!requestParams) return;

	let abortController = new AbortController();
	let request = createRequest(dispatchParams, requestParams, abortController);

	return {
		request,
		abortController,
	};
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
	abortController: AbortController,
): Request {
	let { url, timeoutMs, method } = requestParams;

	let signal = AbortSignal.any([
		AbortSignal.timeout(timeoutMs),
		abortController.signal,
	]);

	return new Request(url, {
		body: dispatchParams.formData,
		signal,
		method,
	});
}
