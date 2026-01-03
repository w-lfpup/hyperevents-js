import { HyperEvents } from "hyperevents";
const _hyperEvents = new HyperEvents({
    host: document,
    connected: true,
    eventNames: ["click"],
});
document.addEventListener("#json", function (e) {
    console.log("#json", e.requestState);
});
