// throttle by element and action
// throttle by _url _action
// Needs to blow up after a certain amount of keys.
let stringMap = new Map();
// throttle by _target _currentTarget
let elementMap = new WeakMap();
export function shouldThrottle(sourceEvent, el, kind, action) {
    let throttle = el.getAttribute(`${kind}:throttle`);
    let timeoutStr = el.getAttribute(`${kind}:throttle-ms`) ?? "";
    let timeoutMs = parseInt(timeoutStr);
    if (throttle && !Number.isNaN(timeoutMs)) {
        // throttle by string
        if ("_url" === throttle) {
            return throttleByString(timeoutMs, action);
        }
        if ("_action" === throttle) { }
        // // throttle by element
        if ("_target" === throttle) {
            throttleByElement(sourceEvent.target, timeoutMs);
        }
        if ("_currentTarget" === throttle) { }
    }
    ;
    return true;
}
function throttleByString(timeoutMs, action) {
    let now = performance.now();
    let throttler = stringMap.get(action);
    if (throttler) {
        let delta = now - throttler.timestamp;
        if (timeoutMs < delta) {
            throttler.abortController?.abort();
            stringMap.set(action, { timestamp: now });
            return false;
        }
    }
    return true;
}
function throttleByElement(el, timeoutMs) {
    if (el) {
        let now = performance.now();
        let throttler = elementMap.get(el);
        if (throttler) {
            let delta = now - throttler.timestamp;
            if (timeoutMs < delta) {
                throttler.abortController?.abort();
                elementMap.set(el, { timestamp: now });
                return false;
            }
        }
    }
    return true;
}
