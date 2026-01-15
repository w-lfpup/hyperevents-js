export interface DispatchParams {
	composed: boolean;
	originElement: Element;
	formData?: FormData;
	kind: string;
	originEvent: Event;
	target: EventTarget;
}

interface RequestParams {
	action: ReturnType<Element["getAttribute"]>;
	method: string;
	timeoutMs?: number;
	url: string;
	originElement: EventTarget;
	originEvent: Event;
}

export interface FetchParamsInterface {
	abortController: AbortController;
	action: ReturnType<Element["getAttribute"]>;
	request: Request;
}

export function removeActionAttr(el: Element, originEvent: Event) {
	let { type } = originEvent;
	queueMicrotask(function () {
		el.removeAttribute(`${type}:`);
	});
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
	let { originElement, originEvent } = dispatchParams;
	let { type } = originEvent;

	let url = originElement.getAttribute(`${type}:url`);
	if (!url) return;

	let action = originElement.getAttribute(`${type}:action`);
	let method = originElement.getAttribute(`${type}:method`) ?? "GET";
	let timeoutMsAttr = originElement.getAttribute(`${type}:timeout-ms`);
	let timeoutMs = parseInt(timeoutMsAttr ?? "");

	return {
		timeoutMs: Number.isNaN(timeoutMs) ? undefined : timeoutMs,
		action,
		url,
		method,
		originElement,
		originEvent,
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
