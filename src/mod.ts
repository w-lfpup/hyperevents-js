import type { ActionEventInterface } from "./action_event.js";
import type { EsModuleEventInterface } from "./esmodule_event.js";
import type { HtmlEventInterface } from "./html_event.js";
import type { JsonEventInterface } from "./json_event.js";

declare global {
	interface GlobalEventHandlersEventMap {
		["#action"]: ActionEventInterface;
		["#esmodule"]: EsModuleEventInterface;
		["#html"]: HtmlEventInterface;
		["#json"]: JsonEventInterface;
	}
}

export type * from "./action_event.ts";
export type * from "./esmodule_event.ts";
export type * from "./json_event.ts";
export type * from "./html_event.ts";
export type * from "./hyper_events.ts";

export { ActionEvent } from "./action_event.js";
export { EsModuleEvent } from "./esmodule_event.js";
export { HtmlEvent } from "./html_event.js";
export { HyperEvents } from "./hyper_events.js";
export { JsonEvent } from "./json_event.js";
