export interface DispatchParams {
    sourceEvent: Event;
    el: Element;
    currentTarget: EventTarget;
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
