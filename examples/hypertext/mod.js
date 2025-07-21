import { SuperChunk } from "superchunk";
import { ActionEvent } from "superchunk";
import { JsonEvent } from "superchunk";
const _superChunk = new SuperChunk({
    host: document,
    connected: true,
    eventNames: ["click", "pointerover"],
});
document.addEventListener("#action", function (e) {
    if (e instanceof ActionEvent) {
        console.log("#action", e, e.actionParams);
    }
});
document.addEventListener("#json", function (e) {
    if (e instanceof JsonEvent) {
        console.log("#json", e, e.jsonParams);
    }
});
