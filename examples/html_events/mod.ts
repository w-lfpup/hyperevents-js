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

document.addEventListener("#html", function (e: HtmlEventInterface) {
	let { requestState: rs } = e;

	if ("update_showcase" === rs.action && "resolved" === rs.status) {
		let template = document.createElement("template");
		template.setHTMLUnsafe(rs.html);
	}
});
