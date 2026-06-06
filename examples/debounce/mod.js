import { HyperEvents } from "hyperevents";
const _hyperEvents = new HyperEvents({
    host: document,
    connected: true,
    eventNames: ["input"],
});
const section = document.querySelector("section");
document.addEventListener("#action", function (e) {
    let { type, target } = e.action;
    if ("display_input" === type && target instanceof HTMLInputElement) {
        section?.setHTMLUnsafe(target.value);
    }
});
