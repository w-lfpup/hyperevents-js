export * from "./action_event.js";
export * from "./esmodule_event.js";
export * from "./json_event.js";
export * from "./html_event.js";
export * from "./hyper_events.js";

// Should ALL of hyperevents operate at the document level

// As in, modules are registerd on the document, they don't make sense elsewhere?
// A queue only makes sense if there is ONE queue. Multiple queues is like multiple
//	centralized state stores.
