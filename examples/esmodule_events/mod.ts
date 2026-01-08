import type { EsModuleEventInterface } from "hyperevents";

import { HyperEvents } from "hyperevents";

declare global {
	interface GlobalEventHandlersEventMap {
		["#esmodule"]: EsModuleEventInterface;
	}
}

const hyperEvents = new HyperEvents({
	host: document,
	connected: true,
	eventNames: ["click"],
});
