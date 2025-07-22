interface Throttled {
	abortController?: AbortController;
	timestamp: DOMHighResTimeStamp;
}

// throttle by _url _action
// Needs to blow up after a certain amount of keys.
let stringMap = new Map<string, Throttled>();

// throttle by _target _currentTarget
let elementMap = new WeakMap<EventTarget, Throttled>();

// two functions throttle
export function shouldThrottle(
	el: Element,
	currentTarget: Event["currentTarget"],
	kind: string,
	prefix: string,
	action?: ReturnType<Element["getAttribute"]>,
	url?: ReturnType<Element["getAttribute"]>,
): boolean {
	let throttle = el.getAttribute(`${kind}:throttle`);
	if (throttle) {
		let timeoutStr = el.getAttribute(`${kind}:throttle-ms`) ?? "";
		let timeoutMs = parseInt(timeoutStr);

		if (!Number.isNaN(timeoutMs)) {
			// throttle by string
			if (url && "url" === throttle) {
				return shouldThrottleByString(
					timeoutMs,
					`${prefix}:${throttle}:${url}`,
				);
			}
			if (action && "action" === throttle) {
				return shouldThrottleByString(
					timeoutMs,
					`${prefix}:${throttle}:${action}`,
				);
			}

			// throttle by element
			if ("target" === throttle) {
				return shouldThrottleByElement(el, timeoutMs);
			}
			if ("currentTarget" === throttle) {
				return shouldThrottleByElement(currentTarget, timeoutMs);
			}
		}
	}

	return false;
}

function shouldThrottleByString(timeoutMs: number, action: string): boolean {
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

function shouldThrottleByElement(
	el: Event["currentTarget"],
	timeoutMs: number,
): boolean {
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

export function setThrottler(
	el: Element,
	currentTarget: Event["currentTarget"],
	kind: string,
	prefix: string,
	action?: ReturnType<Element["getAttribute"]>,
	url?: ReturnType<Element["getAttribute"]>,
	abortController?: AbortController,
) {
	let throttle = el.getAttribute(`${kind}:throttle`);
	if (throttle) {
		let timestamp = performance.now();
		let throttler = { timestamp, abortController };
		// throttle by string
		if (url && "url" === throttle) {
			stringMap.set(`${prefix}:${throttle}:${url}`, throttler);
		}
		if (action && "action" === throttle) {
			stringMap.set(`${prefix}:${throttle}:${action}`, throttler);
		}

		// throttle by element
		if ("target" === throttle) elementMap.set(el, throttler);
		if (currentTarget && "currentTarget" === throttle)
			elementMap.set(currentTarget, throttler);
	}
}
