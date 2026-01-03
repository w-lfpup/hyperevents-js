import { HyperEvents } from "hyperevents";
const _hyperEvents = new HyperEvents({
    host: document,
    connected: true,
    eventNames: ["pointerover"],
});
document.addEventListener("#esmodule", function (e) {
    console.log("#esmodule", e.requestState);
});
