export interface DispatchParams {
    composed: boolean;
    el: Element;
    formData?: FormData;
    kind: string;
    sourceEvent: Event;
    target: EventTarget;
}
export interface FetchParamsInterface {
    abortController: AbortController;
    action: string;
    request: Request;
}
export declare function createFetchParams(dispatchParams: DispatchParams): FetchParamsInterface | undefined;
