import type { Throttler } from "./throttle.js";
import { Queue } from "./queue.js";

// place to put document-wide memory
declare global {
	interface Window {
		["$hyperevents"]: Readonly<RequiredMemory>;
	}
}

interface RequiredMemory {
	throttler: WeakMap<EventTarget, Throttler>;
	queue: Queue;
	debounce: WeakMap<EventTarget, Map<string, number>>;
	modules: Set<string>;
}

let memory: RequiredMemory = window.$hyperevents;
if (!memory)
	memory = Object.freeze({
		throttler: new WeakMap<EventTarget, Throttler>(),
		queue: new Queue(),
		debounce: new WeakMap<EventTarget, Map<string, number>>(),
		modules: new Set<string>(),
	});

window.$hyperevents = memory;

export default memory;
