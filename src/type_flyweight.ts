export interface DispatchParams {
	composed: boolean;
	formData?: FormData;
	kind: string;
	element: Element;
	event: Event;
	target: EventTarget;
	type?: string;
}

interface RequestParams {
	action: ReturnType<Element["getAttribute"]>;
	method: string;
	timeoutMs?: number;
	url: string;
	element: Element;
	event: Event;
}

export interface FetchParamsInterface {
	abortController: AbortController;
	action: ReturnType<Element["getAttribute"]>;
	request: Request;
}

export function createFetchParams(
	dispatchParams: DispatchParams,
): FetchParamsInterface | undefined {
	let requestParams = getRequestParams(dispatchParams);
	if (!requestParams) return;

	let abortController = new AbortController();

	let { action } = requestParams;
	let request = createRequest(dispatchParams, requestParams, abortController);

	return {
		action,
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

	let action = element.getAttribute(`${type}:action`);
	let method = element.getAttribute(`${type}:method`) ?? "GET";
	let timeoutMsAttr = element.getAttribute(`${type}:timeout-ms`);
	let timeoutMs = parseInt(timeoutMsAttr ?? "");

	return {
		timeoutMs: Number.isNaN(timeoutMs) ? undefined : timeoutMs,
		action,
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

	let abortSignals = [abortController.signal];
	if (timeoutMs) abortSignals.push(AbortSignal.timeout(timeoutMs));

	return new Request(url, {
		signal: AbortSignal.any(abortSignals),
		method: method,
		body: dispatchParams.formData,
	});
}
