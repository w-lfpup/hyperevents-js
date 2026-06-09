import { Queue } from "./queue.js";
if (!window["$h-events"])
    window["$h-events"] = {
        throttler: new WeakMap(),
        queue: new Queue(),
        debounce: new WeakMap(),
        modules: new Set(),
    };
