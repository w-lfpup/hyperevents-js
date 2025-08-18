export function getRequestParams(dispatchParams) {
    let { el, sourceEvent } = dispatchParams;
    let { type } = sourceEvent;
    let action = el.getAttribute(`${type}:action`);
    if (!action)
        return;
    let url = el.getAttribute(`${type}:url`);
    if (!url)
        return;
    let method = el.getAttribute(`${type}:method`) ?? "GET";
    let timeoutAttr = el.getAttribute(`${type}:timeout-ms`);
    let timeoutMs = parseInt(timeoutAttr || "3000");
    return {
        timeoutMs: Number.isNaN(timeoutMs) ? undefined : timeoutMs,
        action,
        url,
        method,
    };
}
export function createRequest(dispatchParams, requestParams, abortController) {
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
