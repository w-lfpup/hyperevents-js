export function getRequestParams(dispatchParams) {
    let { el, sourceEvent } = dispatchParams;
    let { type } = sourceEvent;
    let action = el.getAttribute(`${type}:action`);
    let url = el.getAttribute(`${type}:url`);
    let method = el.getAttribute(`${type}:method`);
    let timeoutAttr = el.getAttribute(`${type}:timeout-ms`);
    let timeoutMs = parseInt(timeoutAttr ?? "0");
    return {
        timeoutMs: Number.isNaN(timeoutMs) ? undefined : timeoutMs,
        action,
        url,
        method,
    };
}
export function createRequest(dispatchParams, requestParams, abortController) {
    let { url, timeoutMs, method } = requestParams;
    if (!url)
        return;
    let abortSignals = [abortController.signal];
    if (timeoutMs)
        abortSignals.push(AbortSignal.timeout(timeoutMs));
    return new Request(url, {
        signal: AbortSignal.any(abortSignals),
        method: method ?? "GET",
        body: dispatchParams.formData,
    });
}
