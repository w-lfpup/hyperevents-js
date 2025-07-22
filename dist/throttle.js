// throttle by element and action
// throttle by _url _action
// Needs to blow up after a certain amount of keys.
let stringMap = new Map();
// throttle by _target _currentTarget
let elementMap = new WeakMap();
// two functions throttle
export function shouldThrottle(el, currentTarget, kind, prefix, action, url) {
    let throttle = el.getAttribute(`${kind}:throttle`);
    if (throttle) {
        let timeoutStr = el.getAttribute(`${kind}:throttle-ms`) ?? "";
        let timeoutMs = parseInt(timeoutStr);
        if (!Number.isNaN(timeoutMs)) {
            // throttle by string
            if (url && "url" === throttle) {
                return throttleByString(timeoutMs, `${prefix}:${throttle}:${url}`);
            }
            if (action && "action" === throttle) {
                return throttleByString(timeoutMs, `${prefix}:${throttle}:${action}`);
            }
            // throttle by element
            if ("target" === throttle) {
                return throttleByElement(el, timeoutMs);
            }
            if ("currentTarget" === throttle) {
                return throttleByElement(currentTarget, timeoutMs);
            }
        }
    }
    return false;
}
function throttleByString(timeoutMs, action) {
    let throttler = stringMap.get(action);
    if (throttler) {
        let now = performance.now();
        let delta = now - throttler.timestamp;
        if (timeoutMs > delta) {
            throttler.abortController?.abort();
            return false;
        }
    }
    return true;
}
function throttleByElement(el, timeoutMs) {
    if (el) {
        let throttler = elementMap.get(el);
        if (throttler) {
            let now = performance.now();
            let delta = now - throttler.timestamp;
            if (timeoutMs < delta) {
                throttler.abortController?.abort();
                return false;
            }
        }
    }
    return true;
}
