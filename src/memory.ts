import type { Throttler } from "./throttle.js";
import { Queue } from "./queue.js";

// place to put document-wide memory
declare global {
	interface Window {
		["$hyperevents"]: Readonly<RequiredMemory>;
	}
}

interface RequiredMemory {
	version: string;
	throttler: WeakMap<EventTarget, Throttler>;
	queue: Queue;
	debounce: WeakMap<EventTarget, Map<string, number>>;
	modules: Set<string>;
}

let memory: RequiredMemory = window.$hyperevents;
if (!memory) {
	let descriptor = Object.getOwnPropertyDescriptor(window, "$hyperevents");
	if (descriptor && !descriptor.configurable)
		throw new Error(
			"The property window[$hyperevents] is not configurable.",
		);

	// Manual version bump required. Reflect package version.
	// However, the property "version" is not required.
	memory = Object.freeze({
		version: "0.2.1",
		throttler: new WeakMap<EventTarget, Throttler>(),
		queue: new Queue(),
		debounce: new WeakMap<EventTarget, Map<string, number>>(),
		modules: new Set<string>(),
	});

	Object.defineProperty(window, "$hyperevents", {
		configurable: false,
		writable: false,
		value: memory,
	});
}

export default memory;
