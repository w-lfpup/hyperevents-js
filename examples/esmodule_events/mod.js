import { HyperEvents } from "hyperevents";
const hyperEvents = new HyperEvents({
    host: document,
    connected: true,
    eventNames: ["click"],
});
