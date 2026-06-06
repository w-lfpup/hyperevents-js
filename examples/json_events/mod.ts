import { HyperEvents } from "hyperevents";

const _hyperEvents = new HyperEvents({
	host: document,
	connected: true,
	eventNames: ["click"],
});

let section = document.querySelector("section");

document.addEventListener("#json", function (e) {
	let { requestState: rs } = e;

	if ("resolved" === rs.status) {
		section?.setHTMLUnsafe(rs.json);
	}
});
