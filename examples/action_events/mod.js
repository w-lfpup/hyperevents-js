import { HyperEvents } from "hyperevents";
const _hyperEvents = new HyperEvents({
    target: document,
    connected: true,
    eventNames: ["click", "pointerover"],
});
document.addEventListener("#action", function (e) {
    console.log("#action", e.actionParams);
});
