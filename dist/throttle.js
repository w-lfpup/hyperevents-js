// throttle by _url _action
// Needs to blow up after a certain amount of keys.
let stringMap = new Map();
// throttle by _target _currentTarget
let elementMap = new WeakMap();
export function getThrottleParams(dispatchParams, params) {
    let { el, sourceEvent } = dispatchParams;
    let { type } = sourceEvent;
    return {
        throttle: el.getAttribute(`${type}:throttle`),
        throttleTimeoutMs: el.getAttribute(`${type}:throttle-ms`),
        ...params,
    };
}
export function shouldThrottle(dispatchParams, throttleParams) {
    let { el } = dispatchParams;
    let { throttle, throttleTimeoutMs } = throttleParams;
    if (throttle && throttleTimeoutMs) {
        let timeoutMs = parseInt(throttleTimeoutMs ?? "");
        if (!Number.isNaN(timeoutMs)) {
            // throttle by string
            let { currentTarget } = dispatchParams;
            let { url, prefix, action } = throttleParams;
            if (url && "url" === throttle)
                return shouldThrottleByString(timeoutMs, `${prefix}:${throttle}:${url}`);
            if (action && "action" === throttle)
                return shouldThrottleByString(timeoutMs, `${prefix}:${throttle}:${action}`);
            // throttle by element
            if ("target" === throttle)
                return shouldThrottleByElement(el, timeoutMs);
            if ("currentTarget" === throttle)
                return shouldThrottleByElement(currentTarget, timeoutMs);
        }
    }
    return false;
}
function shouldThrottleByString(timeoutMs, action) {
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
    let { el, sourceEvent, currentTarget } = params;
    let throttle = el.getAttribute(`${sourceEvent.type}}:throttle`);
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
        if ("target" === throttle)
            elementMap.set(el, throttler);
        if (currentTarget && "currentTarget" === throttle)
            elementMap.set(currentTarget, throttler);
    }
}
