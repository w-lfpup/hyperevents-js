let elementMap = new WeakMap();
export function throttled(params, abortParams) {
    let throttleParams = getThrottleParams(params);
    if (!throttleParams)
        return false;
    if (shouldThrottle(params, throttleParams))
        return true;
    let { el, sourceEvent } = params;
    let { timeStamp, type } = sourceEvent;
    elementMap.set(el, { timeStamp, type, abortParams });
    return false;
}
function getThrottleParams(dispatchParams) {
    let { el, sourceEvent } = dispatchParams;
    let { type } = sourceEvent;
    let windowMsAttr = el.getAttribute(`${type}:throttle-ms`);
    if (null === windowMsAttr)
        return;
    let windowMs = parseInt(windowMsAttr);
    if (Number.isNaN(windowMs))
        return;
    return {
        windowMs,
    };
}
function shouldThrottle(dispatchParams, throttleParams) {
    let { el, sourceEvent } = dispatchParams;
    let { windowMs } = throttleParams;
    let throttleEl = el;
    let throttler = elementMap.get(throttleEl);
    if (throttler) {
        let delta = performance.now() - throttler.timeStamp;
        if (sourceEvent.type === throttler.type) {
            if (delta < windowMs)
                return true;
            throttler.abortParams?.abortController.abort();
        }
    }
    return false;
}
