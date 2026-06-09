import type { Throttler } from "./throttle.js";
import { Queue } from "./queue.js";
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
declare let memory: RequiredMemory;
export default memory;
