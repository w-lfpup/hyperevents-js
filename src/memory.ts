import type { Throttler } from "./throttle.js";
import { Queue } from "./queue.js";

// place to put document-wide memory
declare global {
	interface Window {
		["$hyperevents"]: Readonly<{
			throttler: WeakMap<EventTarget, Throttler>;
			queue: Queue;
			debounce: WeakMap<EventTarget, Map<string, number>>;
			modules: Set<string>;
		}>;
	}
}

if (!window["$hyperevents"])
	window["$hyperevents"] = Object.freeze({
		throttler: new WeakMap<EventTarget, Throttler>(),
		queue: new Queue(),
		debounce: new WeakMap<EventTarget, Map<string, number>>(),
		modules: new Set<string>(),
	});

// but what if we exported like normal?
// export like normal
