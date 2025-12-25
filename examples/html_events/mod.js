import { HyperEvents } from "hyperevents";
const _hyperEvents = new HyperEvents({
    host: document,
    connected: true,
    eventNames: ["click", "pointerover"],
});
document.addEventListener("#html", function (e) {
    console.log("#html", e.requestState);
});
