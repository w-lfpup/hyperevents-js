export interface DispatchParams {
    composed: boolean;
    el: Element;
    formData?: FormData;
    kind: string;
    sourceEvent: Event;
    target: EventTarget;
}
export interface FetchParamsInterface {
    request: Request;
    action: string;
    abortController: AbortController;
}
export declare function createFetchParams(dispatchParams: DispatchParams): FetchParamsInterface | undefined;
