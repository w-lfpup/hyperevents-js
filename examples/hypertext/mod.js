import { HyperEvents } from "hyperevents";
const _hyperEvents = new HyperEvents({
    target: document,
    connected: true,
    eventNames: ["click", "pointerover"],
});
document.addEventListener("#action", function (e) {
    console.log("#action", e, e.actionParams);
});
document.addEventListener("#esmodule", function (e) {
    console.log("#esmodule", e, e.requestState);
});
document.addEventListener("#json", function (e) {
    console.log("#json", e, e.requestState);
});
document.addEventListener("#html", function (e) {
    console.log("#html", e, e.requestState);
});
