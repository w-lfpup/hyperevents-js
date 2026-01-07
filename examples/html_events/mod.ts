import type { HtmlEventInterface } from "hyperevents";

import { HyperEvents } from "hyperevents";

/*
	SETUP HYPEREVENTS
*/

declare global {
	interface GlobalEventHandlersEventMap {
		["#html"]: HtmlEventInterface;
	}
}

const _hyperEvents = new HyperEvents({
	host: document,
	connected: true,
	eventNames: ["click"],
});

/*
	RESPOND TO HTML EVENTS
*/

let figure = document.querySelector("figure");

document.addEventListener("#html", function (e: HtmlEventInterface) {
	let { requestState: rs } = e;

	if ("resolved" === rs.status) {
		figure?.setHTMLUnsafe(rs.html);
	}
});
