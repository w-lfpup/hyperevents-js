import {
	SuperChunk,
	ActionEvent,
	HtmlEvent,
	JsonEvent,
	ESModuleEvent,
} from "superchunk";

const _superChunk = new SuperChunk({
	target: document,
	connected: true,
	eventNames: ["click", "pointerover"],
});

document.addEventListener("#esmodule", function (e: Event) {
	if (e instanceof ESModuleEvent) console.log("#esmodule", e, e.requestState);
});

document.addEventListener("#action", function (e: Event) {
	if (e instanceof ActionEvent) console.log("#action", e, e.actionParams);
});

document.addEventListener("#json", function (e: Event) {
	if (e instanceof JsonEvent) console.log("#json", e, e.requestState);
});

document.addEventListener("#html", function (e: Event) {
	if (e instanceof HtmlEvent) console.log("#html", e, e.status);
});
