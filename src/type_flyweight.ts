export interface DispatchParams {
	sourceEvent: Event;
	el: Element;
	currentTarget: Event["currentTarget"];
	formData?: FormData;
}

export interface ActionParams {
	action?: ReturnType<Element["getAttribute"]>;
}

export interface RequestParams extends ActionParams {
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
	let timeoutMs = parseInt(timeoutAttr ?? "");

	return {
		timeoutMs: Number.isNaN(timeoutMs) ? undefined : timeoutMs,
		action,
		url,
		method,
	};
}
