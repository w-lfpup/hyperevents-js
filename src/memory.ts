import type { Throttler } from "./throttle.js";
import { Queue } from "./queue.js";

// place to put document-wide memory
declare global {
	interface Window {
		["$hyperevents"]: {
			throttler: WeakMap<EventTarget, Throttler>;
			queue: Queue;
			debounce: WeakMap<EventTarget, Map<string, number>>;
			modules: Set<string>;
		};
	}
}

if (!window["$hyperevents"])
	window["$hyperevents"] = {
		throttler: new WeakMap(),
		queue: new Queue(),
		debounce: new WeakMap(),
		modules: new Set(),
	};

// export like normal
