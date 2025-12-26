import type { ActionEventInterface } from "hyperevents";

import { HyperEvents } from "hyperevents";

declare global {
	interface GlobalEventHandlersEventMap {
		["#action"]: ActionEventInterface;
	}
}

const _hyperEvents = new HyperEvents({
	host: document,
	connected: true,
	eventNames: ["click", "pointerover"],
});

document.addEventListener("#action", function (e) {
	console.log("#action", e.actionParams);
});
