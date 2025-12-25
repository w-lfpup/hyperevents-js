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
export declare function getRequestParams(dispatchParams: DispatchParams): RequestParams | undefined;
export declare function createRequest(dispatchParams: DispatchParams, requestParams: RequestParams, abortController: AbortController): Request | undefined;
