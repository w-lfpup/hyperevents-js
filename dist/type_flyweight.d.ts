export interface DispatchParams {
    sourceEvent: Event;
    el: Element;
    currentTarget: EventTarget;
    composed: boolean;
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
export declare function getRequestParams(dispatchParams: DispatchParams): RequestParams | undefined;
export declare function createRequest(dispatchParams: DispatchParams, requestParams: RequestParams, abortController: AbortController): Request | undefined;
