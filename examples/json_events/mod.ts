import type { JsonEventInterface } from "hyperevents";

import { HyperEvents } from "hyperevents";

declare global {
	interface GlobalEventHandlersEventMap {
		["#json"]: JsonEventInterface;
	}
}

const _hyperEvents = new HyperEvents({
	host: document,
	connected: true,
	eventNames: ["click"],
});

let ul = document.querySelector("ul");

document.addEventListener("#json", function (e) {
	let { requestState: rs } = e;

	if ("resolved" === rs.status) {
		let li = document.createElement("li");

		li.textContent = JSON.stringify(rs.json);
		ul?.appendChild(li);
	}
});
