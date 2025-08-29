import type {
	ActionEventInterface,
	EsModuleEventInterface,
	JsonEventInterface,
	HtmlEventInterface,
} from "hyperevents";

import { HyperEvents } from "hyperevents";

declare global {
	interface GlobalEventHandlersEventMap {
		["#esmodule"]: EsModuleEventInterface;
	}
}

const _hyperEvents = new HyperEvents({
	target: document,
	connected: true,
	eventNames: ["click", "pointerover"],
});

document.addEventListener("#esmodule", function (e) {
	console.log("#esmodule", e.requestState);
});
