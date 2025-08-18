import type {
	ActionEvent,
	HtmlEvent,
	JsonEvent,
	ESModuleEvent,
} from "hyperevents";

import { HyperEvents } from "hyperevents";

declare global {
	interface GlobalEventHandlersEventMap {
		["#action"]: ActionEvent;
		["#esmodule"]: ESModuleEvent;
		["#json"]: JsonEvent;
		["#html"]: HtmlEvent;
	}
}

const _hyperEvents = new HyperEvents({
	target: document,
	connected: true,
	eventNames: ["click", "pointerover"],
});

document.addEventListener("#action", function (e: ActionEvent) {
	console.log("#action", e, e.actionParams);
});

document.addEventListener("#esmodule", function (e: ESModuleEvent) {
	console.log("#esmodule", e, e.requestState);
});

document.addEventListener("#json", function (e: JsonEvent) {
	console.log("#json", e, e.requestState);
});

document.addEventListener("#html", function (e: HtmlEvent) {
	console.log("#html", e, e.requestState);
});
