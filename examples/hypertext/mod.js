import { SuperChunk, ActionEvent, HtmlEvent, JsonEvent, ESModuleEvent, } from "superchunk";
const _superChunk = new SuperChunk({
    target: document,
    connected: true,
    eventNames: ["click", "pointerover"],
});
document.addEventListener("#esmodule", function (e) {
    if (e instanceof ESModuleEvent)
        console.log("#esmodule", e, e.requestState);
});
document.addEventListener("#action", function (e) {
    if (e instanceof ActionEvent)
        console.log("#action", e, e.actionParams);
});
document.addEventListener("#json", function (e) {
    if (e instanceof JsonEvent)
        console.log("#json", e, e.requestState);
});
document.addEventListener("#html", function (e) {
    if (e instanceof HtmlEvent)
        console.log("#html", e, e.status);
});
