import { Queue } from "./queue.js";
let memory = window.$hyperevents;
if (!memory)
    memory = Object.freeze({
        throttler: new WeakMap(),
        queue: new Queue(),
        debounce: new WeakMap(),
        modules: new Set(),
    });
window.$hyperevents = memory;
export default memory;
