import { HyperEvents } from "hyperevents";
const _hyperEvents = new HyperEvents({
    target: document,
    connected: true,
    eventNames: ["click", "pointerover"],
});
document.addEventListener("#esmodule", function (e) {
    console.log("#esmodule", e.requestState);
});
