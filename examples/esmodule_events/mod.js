import { HyperEvents } from "hyperevents";
const _hyperEvents = new HyperEvents({
    host: document,
    connected: true,
    eventNames: ["click"],
});
document.addEventListener("#esmodule", function (e) {
    console.log("#esmodule", e.requestState);
});
