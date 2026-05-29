export interface DispatchParams {
	composed: boolean;
	formData?: FormData;
	kind: string;
	element: Element; // host ? necessary?
	event: Event;
	target: EventTarget; // element that has the action
	type?: string;
}

interface RequestParams {
	method: string;
	timeoutMs: number;
	url: string;
	element: Element; // needed?
	event: Event;
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
	let { element, event } = dispatchParams;
	let { type } = event;

	let url = element.getAttribute(`${type}:url`);
	if (!url) return;

	let method = element.getAttribute(`${type}:method`) ?? "GET";
	let timeoutMsAttr = element.getAttribute(`${type}:timeout-ms`);
	let timeoutMs = parseInt(timeoutMsAttr ?? "");
	if (Number.isNaN(timeoutMs)) timeoutMs = FALLBACK_TIMEOUT_MS;

	return {
		timeoutMs,
		url,
		method,
		element,
		event,
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
