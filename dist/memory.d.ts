import type { Throttler } from "./throttle.js";
import { Queue } from "./queue.js";
declare global {
    interface Window {
        ["$h-events"]: {
            throttler: WeakMap<EventTarget, Throttler>;
            queue: Queue;
            debounce: WeakMap<EventTarget, Map<string, number>>;
            modules: Set<string>;
        };
    }
}
