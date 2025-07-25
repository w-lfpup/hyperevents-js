import { SuperChunk, ActionEvent, HtmlEvent, JsonEvent } from "superchunk";

const _superChunk = new SuperChunk({
	host: document,
	connected: true,
	eventNames: ["click", "pointerover"],
});

document.addEventListener("#action", function (e: Event) {
	if (e instanceof ActionEvent) console.log("#action", e, e.actionParams);
});

document.addEventListener("#json", function (e: Event) {
	if (e instanceof JsonEvent) console.log("#json", e, e.jsonParams);
});

document.addEventListener("#html", function (e: Event) {
	if (e instanceof HtmlEvent) console.log("#html", e, e.htmlParams);
});
