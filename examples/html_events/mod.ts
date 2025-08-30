import type { HtmlEventInterface } from "hyperevents";

import { HyperEvents } from "hyperevents";

declare global {
	interface GlobalEventHandlersEventMap {
		["#html"]: HtmlEventInterface;
	}
}

const _hyperEvents = new HyperEvents({
	target: document,
	connected: true,
	eventNames: ["click", "pointerover"],
});

document.addEventListener("#html", function (e) {
	console.log("#html", e.requestState);
});
