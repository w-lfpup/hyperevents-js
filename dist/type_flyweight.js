export function getRequestParams(dispatchParams) {
    let { el, sourceEvent } = dispatchParams;
    let { type } = sourceEvent;
    let action = el.getAttribute(`${type}:action`);
    let url = el.getAttribute(`${type}:url`);
    let method = el.getAttribute(`${type}:method`);
    let timeoutAttr = el.getAttribute(`${type}:timeout-ms`);
    let timeoutMs = parseInt(timeoutAttr ?? "");
    return {
        timeoutMs: (Number.isNaN(timeoutMs)) ? undefined : timeoutMs,
        action,
        url,
        method,
    };
}
