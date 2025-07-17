import { SuperChunk } from "superchunk";
import { ActionEvent } from "superchunk";
const _superChunk = new SuperChunk({
    host: document,
    connected: true,
    eventNames: ["click"],
});
document.addEventListener("#action", function (e) {
    if (e instanceof ActionEvent) {
        console.log("#action", e.actionParams);
    }
});
