// throttle by _url _action
// Needs to blow up after a certain amount of keys.
let stringMap = new Map();
// throttle by _target _currentTarget
let elementMap = new WeakMap();
export function getThrottleParams(dispatchParams, params) {
    let { el, sourceEvent } = dispatchParams;
    let { type } = sourceEvent;
    let throttle = el.getAttribute(`${type}:throttle`);
    let throttleMsAttr = el.getAttribute(`${type}:throttle-ms`) ?? "";
    let timeoutMs = parseInt(throttleMsAttr);
    if (!throttle || Number.isNaN(timeoutMs))
        return;
    let throttleParams = {
        throttle,
        timeoutMs,
        ...params,
    };
    if (shouldThrottle(dispatchParams, throttleParams)) {
        return throttleParams;
    }
}
function shouldThrottle(dispatchParams, throttleParams) {
    let { currentTarget, el } = dispatchParams;
    let { action, prefix, throttle, timeoutMs, url } = throttleParams;
    if ("_target" === throttle)
        return shouldThrottleByElement(el, timeoutMs);
    if ("_currentTarget" === throttle)
        return shouldThrottleByElement(currentTarget, timeoutMs);
    if (url && "url" === throttle)
        return shouldThrottleByString(`${prefix}:${throttle}:${url}`, timeoutMs);
    if (action && "action" === throttle)
        return shouldThrottleByString(`${prefix}:${throttle}:${action}`, timeoutMs);
    return false;
}
function shouldThrottleByString(action, timeoutMs) {
    let throttler = stringMap.get(action);
    if (throttler) {
        let delta = performance.now() - throttler.timestamp;
        if (delta < timeoutMs) {
            return true;
        }
        throttler.abortController?.abort();
    }
    return false;
}
function shouldThrottleByElement(el, timeoutMs) {
    if (el) {
        let throttler = elementMap.get(el);
        if (throttler) {
            let delta = performance.now() - throttler.timestamp;
            if (delta < timeoutMs) {
                return true;
            }
            throttler.abortController?.abort();
        }
    }
    return false;
}
export function setThrottler(params, throttleParams, abortController) {
    let { el, currentTarget } = params;
    let { throttle } = throttleParams;
    if (throttle) {
        let { url, prefix, action } = throttleParams;
        let timestamp = performance.now();
        let throttler = { timestamp, abortController };
        // throttle by string
        if (url && "url" === throttle)
            stringMap.set(`${prefix}:${throttle}:${url}`, throttler);
        if (action && "action" === throttle)
            stringMap.set(`${prefix}:${throttle}:${action}`, throttler);
        // throttle by element
        if ("_target" === throttle)
            elementMap.set(el, throttler);
        if (currentTarget && "_currentTarget" === throttle)
            elementMap.set(currentTarget, throttler);
    }
}
