let elementMap = new WeakMap();
export function throttled(params) {
    let abortController = undefined;
    let windowMs = getThrottleParams(params);
    if (!windowMs)
        return { throttle: false };
    if (shouldThrottle(params, windowMs))
        return { throttle: true };
    let { target, event } = params;
    abortController = new AbortController();
    window["$h-events"].throttler.set(target, { event, abortController });
    return { throttle: false, abortController };
}
function getThrottleParams(dispatchParams) {
    let { target, event, infix } = dispatchParams;
    let windowMsAttr = target.getAttribute(`${event.type}${infix}throttle-ms`);
    if (null === windowMsAttr)
        return;
    let windowMs = parseInt(windowMsAttr);
    if (!Number.isNaN(windowMs))
        return windowMs;
}
function shouldThrottle(dispatchParams, windowMs) {
    let { target, event } = dispatchParams;
    let throttler = window["$h-events"].throttler.get(target);
    if (throttler) {
        let { event: prevEvent, abortController } = throttler;
        let delta = Math.max(0, event.timeStamp - prevEvent.timeStamp);
        if (event.type === prevEvent.type && delta < windowMs)
            return true;
        abortController.abort();
    }
    return false;
}
