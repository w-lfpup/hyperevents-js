import type { JsonEventInterface } from "hyperevents";

import { HyperEvents } from "hyperevents";

declare global {
	interface GlobalEventHandlersEventMap {
		["#json"]: JsonEventInterface;
	}
}

const _hyperEvents = new HyperEvents({
	target: document,
	connected: true,
	eventNames: ["click", "pointerover"],
});

document.addEventListener("#json", function (e) {
	console.log("#json", e.requestState);
});
