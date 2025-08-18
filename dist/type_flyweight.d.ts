export interface DispatchParams {
    sourceEvent: Event;
    el: Element;
    currentTarget: EventTarget;
    composed: boolean;
    formData?: FormData;
}
export interface RequestParams {
    action: string;
    url: string;
    method: string;
    timeoutMs?: number;
}
export declare function getRequestParams(dispatchParams: DispatchParams): RequestParams | undefined;
export declare function createRequest(dispatchParams: DispatchParams, requestParams: RequestParams, abortController: AbortController): Request | undefined;
