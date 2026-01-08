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

let count = 0;
let span = document.querySelector("span");

document.addEventListener("#action", function (e) {
	if (!span) return;

	let { action } = e.dispatchParams;

	if ("increase_count" === action) {
		count += 1;
		span.textContent = count.toString();
	}
});
