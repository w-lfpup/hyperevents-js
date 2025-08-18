let elementMap = new WeakMap();
export function getThrottleParams(dispatchParams, prefix) {
    let { el, sourceEvent } = dispatchParams;
    let { type } = sourceEvent;
    let throttle = el.getAttribute(`${type}:throttle`);
    if (!throttle)
        return;
    let throttleMsAttr = el.getAttribute(`${type}:throttle-ms`);
    let timeoutMs = parseInt(throttleMsAttr ?? "");
    if (Number.isNaN(timeoutMs))
        return;
    return {
        prefix,
        throttle,
        timeoutMs,
    };
}
export function shouldThrottle(dispatchParams, throttleParams) {
    if (!throttleParams)
        return false;
    let { currentTarget, el } = dispatchParams;
    let { prefix, throttle, timeoutMs } = throttleParams;
    if ("_target" === throttle)
        return shouldThrottleByElement(el, timeoutMs);
    if ("_currentTarget" === throttle)
        return shouldThrottleByElement(currentTarget, timeoutMs);
    if ("_document" === throttle)
        return shouldThrottleByElement(document, timeoutMs);
    return false;
}
function shouldThrottleByElement(el, timeoutMs) {
    if (!el)
        return false;
    let throttler = elementMap.get(el);
    return compareThrottler(throttler, timeoutMs);
}
function compareThrottler(throttler, timeoutMs) {
    if (throttler) {
        let delta = performance.now() - throttler.timeStamp;
        if (delta < timeoutMs) {
            return true;
        }
        throttler.abortController?.abort();
    }
    return false;
}
export function setThrottler(params, throttleParams, abortController) {
    if (!throttleParams)
        return;
    let { throttle, prefix } = throttleParams;
    let { el, currentTarget, sourceEvent } = params;
    let { timeStamp } = sourceEvent;
    let throttler = { timeStamp, abortController };
    let throttleEl = currentTarget;
    if ("_target" === throttle)
        throttleEl = el;
    if ("_document" === throttle)
        throttleEl = document;
    if ("html" === prefix)
        elementMap.set(throttleEl, throttler);
    if ("json" === prefix)
        elementMap.set(throttleEl, throttler);
}
