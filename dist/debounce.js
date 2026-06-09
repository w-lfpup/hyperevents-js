let elementMap = new WeakMap();
export function debounced(params, cb) {
    let windowMs = getDebouncedParams(params);
    if (!windowMs)
        return false;
    let { target, event } = params;
    let debounceMap = elementMap.get(target);
    if (!debounceMap) {
        debounceMap = new Map();
        elementMap.set(target, debounceMap);
    }
    let prevReceipt = debounceMap.get(event.type);
    if (prevReceipt)
        window.clearTimeout(prevReceipt);
    let receipt = window.setTimeout(function () {
        cb(params);
        debounceMap.delete(event.type);
        if (!debounceMap.size)
            elementMap.delete(target);
    }, windowMs);
    debounceMap.set(event.type, receipt);
    return true;
}
function getDebouncedParams(dispatchParams) {
    let { target, event, infix } = dispatchParams;
    let windowMsAttr = target.getAttribute(`${event.type}${infix}debounce-ms`);
    if (null === windowMsAttr)
        return;
    let windowMs = parseInt(windowMsAttr);
    if (!Number.isNaN(windowMs))
        return windowMs;
}
