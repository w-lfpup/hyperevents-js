import type { ActionEventInterface, HtmlEventInterface } from "hyperevents";

import { HyperEvents } from "hyperevents";

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

let figure = document.querySelector("figure");

document.addEventListener("#action", function (e: ActionEventInterface) {
	let { action } = e.dispatchParams;
	if ("clear_queue_list" === action) {
		figure?.replaceChildren();
	}
});

document.addEventListener("#html", function (e: HtmlEventInterface) {
	let { requestState: rs } = e;

	if ("queued" === rs.status) {
		console.log("queued!!", rs);
		// add p saying "action" and "request.url" have been queued
	}

	if ("resolved" === rs.status) {
		figure?.setHTMLUnsafe(rs.html);
	}
});
