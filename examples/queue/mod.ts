import type { HtmlEventInterface } from "hyperevents";

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

let ul = document.querySelector("ul");

document.addEventListener("#html", function (e: HtmlEventInterface) {
	let { requestState: rs } = e;

	if ("queued" === rs.status) {
		let p = document.createElement("p");
		p.textContent = `queued: ${rs.request.url}`;

		let li = document.createElement("li");
		li.append(p);
		ul?.append(li);
	}

	if ("resolved" === rs.status) {
		let li = document.createElement("li");
		li.setHTMLUnsafe(rs.html);
		ul?.append(li);
	}
});
