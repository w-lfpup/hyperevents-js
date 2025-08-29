import { HyperEvents } from "hyperevents";
const _hyperEvents = new HyperEvents({
    target: document,
    connected: true,
    eventNames: ["click", "pointerover"],
});
document.addEventListener("#json", function (e) {
    console.log("#json", e.requestState);
});
