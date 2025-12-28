function getRequestParams(dispatchParams) {
    let { el, sourceEvent } = dispatchParams;
    let { type } = sourceEvent;
    let action = el.getAttribute(`${type}:action`);
    if (!action)
        return;
    let url = el.getAttribute(`${type}:url`);
    if (!url)
        return;
    let method = el.getAttribute(`${type}:method`) ?? "GET";
    let timeoutMsAttr = el.getAttribute(`${type}:timeout-ms`);
    let timeoutMs = parseInt(timeoutMsAttr ?? "");
    return {
        timeoutMs: Number.isNaN(timeoutMs) ? undefined : timeoutMs,
        action,
        url,
        method,
    };
}
function createRequest(dispatchParams, requestParams, abortController) {
    let { url, timeoutMs, method } = requestParams;
    let abortSignals = [abortController.signal];
    if (timeoutMs)
        abortSignals.push(AbortSignal.timeout(timeoutMs));
    return new Request(url, {
        signal: AbortSignal.any(abortSignals),
        method: method,
        body: dispatchParams.formData,
    });
}
export function createFetchParams(dispatchParams) {
    let requestParams = getRequestParams(dispatchParams);
    if (!requestParams)
        return;
    let abortController = new AbortController();
    let { action } = requestParams;
    let request = createRequest(dispatchParams, requestParams, abortController);
    return {
        action,
        request,
        abortController,
    };
}
