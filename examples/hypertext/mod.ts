import { SuperChunk } from "superchunk";
import { ActionEvent } from "superchunk";
import { JsonEvent } from "superchunk";

const _superChunk = new SuperChunk({
	host: document,
	connected: true,
	eventNames: ["click"],
});

document.addEventListener("#action", function (e: Event) {
	if (e instanceof ActionEvent) {
		console.log("#action", e, e.actionParams);
	}
});

document.addEventListener("#json", function (e: Event) {
	if (e instanceof JsonEvent) {
		console.log("#json", e, e.jsonParams);
	}
});
