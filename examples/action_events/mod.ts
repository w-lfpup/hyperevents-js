import { HyperEvents } from "hyperevents";

const _hyperEvents = new HyperEvents({
	host: document,
	connected: true,
	eventNames: ["click"],
});

let count = 0;
let span = document.querySelector("span");

document.addEventListener("#action", function (e) {
	if (!span) return;

	let { type } = e.action;

	if ("increase_count" === type) {
		count += 1;
		span.textContent = count.toString();
	}
});
