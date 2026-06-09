let elementMap = new WeakMap();
function debounced(params, abortParams) {
    let debouncedParams = getDebouncedParams(params);
    if (!debouncedParams)
        return false;
}
function getDebouncedParams(dispatchParams) {
    let { target, event } = dispatchParams;
    let windowMsAttr = target.getAttribute(`${event.type}:debounce-ms`);
    if (null === windowMsAttr)
        return;
    let windowMs = parseInt(windowMsAttr);
    if (Number.isNaN(windowMs))
        return;
    return {
        windowMs,
    };
}
export {};
