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
    action?: ReturnType<Element["getAttribute"]>;
    url?: ReturnType<Element["getAttribute"]>;
    method?: ReturnType<Element["getAttribute"]>;
    timeoutMs?: number;
}
export declare function getRequestParams(dispatchParams: DispatchParams): RequestParams | undefined;
