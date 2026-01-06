import type { EsModuleEventInterface } from "hyperevents";

import { HyperEvents } from "hyperevents";

declare global {
	interface GlobalEventHandlersEventMap {
		["#esmodule"]: EsModuleEventInterface;
	}
}

const _hyperEvents = new HyperEvents({
	host: document,
	connected: true,
	eventNames: ["click"],
});

const ul = document.querySelector("ul");

document.addEventListener("#action", function (e) {
	console.log("#action", e.actionParams);

	let { timeStamp, type } = e.actionParams.sourceEvent;
	const li = document.createElement("li");
	li.textContent = `action occured at: ${timeStamp.toFixed(2)} on ${type}:`;
	ul?.append(li);
});
