// throttle by _url _action
// Needs to blow up after a certain amount of keys.
let stringMap = new Map();
// throttle by _target _currentTarget
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
export function shouldThrottle(dispatchParams, requestParams, throttleParams) {
    if (!throttleParams)
        return false;
    let { currentTarget, el } = dispatchParams;
    let { action, url } = requestParams;
    let { prefix, throttle, timeoutMs } = throttleParams;
    if ("_target" === throttle)
        return shouldThrottleByElement(el, timeoutMs);
    if ("_currentTarget" === throttle)
        return shouldThrottleByElement(currentTarget, timeoutMs);
    if ("_action" === throttle && action)
        return shouldThrottleByString(getKey(prefix, throttle, action), timeoutMs);
    if ("_url" === throttle && url)
        return shouldThrottleByString(getKey(prefix, throttle, url), timeoutMs);
    return false;
}
function shouldThrottleByString(action, timeoutMs) {
    let throttler = stringMap.get(action);
    return compareThrottler(throttler, timeoutMs);
}
function shouldThrottleByElement(el, timeoutMs) {
    if (!el)
        return false;
    let throttler = elementMap.get(el);
    return compareThrottler(throttler, timeoutMs);
}
export function setThrottler(params, requestParams, throttleParams, abortController) {
    if (!throttleParams)
        return;
    let { el, currentTarget } = params;
    let { throttle, prefix } = throttleParams;
    if (throttle) {
        let { url, action } = requestParams;
        let timestamp = performance.now();
        let throttler = { timestamp, abortController };
        // throttle by element
        if ("_target" === throttle)
            elementMap.set(el, throttler);
        if ("_currentTarget" === throttle && currentTarget)
            elementMap.set(currentTarget, throttler);
        // throttle by string
        if ("_url" === throttle && url)
            stringMap.set(getKey(prefix, throttle, url), throttler);
        if ("_action" === throttle && action)
            stringMap.set(getKey(prefix, throttle, action), throttler);
    }
}
function getKey(prefix, throttle, kind) {
    return `${prefix}:${throttle}:${kind}`;
}
function compareThrottler(throttler, timeoutMs) {
    if (throttler) {
        let delta = performance.now() - throttler.timestamp;
        if (delta < timeoutMs) {
            return true;
        }
        throttler.abortController?.abort();
    }
    return false;
}
