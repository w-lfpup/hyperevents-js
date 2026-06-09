import { Queue } from "./queue.js";
let memory = window.$hyperevents;
if (!memory) {
    let descriptor = Object.getOwnPropertyDescriptor(window, "$hyperevents");
    if (descriptor && !descriptor.configurable)
        throw new Error("The property window[$hyperevents] is not configurable.");
    memory = Object.freeze({
        throttler: new WeakMap(),
        queue: new Queue(),
        debounce: new WeakMap(),
        modules: new Set(),
    });
    Object.defineProperty(window, "$hyperevents", {
        configurable: false,
        writable: false,
        value: memory,
    });
}
export default memory;
