import { HyperEvents } from "hyperevents";
const _hyperEvents = new HyperEvents({
    host: document,
    connected: true,
    eventNames: ["click"],
});
let figure = document.querySelector("figure");
document.addEventListener("#action", function (e) {
    let { action } = e.dispatchParams;
    if ("clear_queue_list" === action) {
        figure?.replaceChildren();
    }
});
document.addEventListener("#html", function (e) {
    let { requestState: rs } = e;
    if ("queued" === rs.status) {
        console.log("queued!!", rs);
    }
    if ("resolved" === rs.status) {
        figure?.setHTMLUnsafe(rs.html);
    }
});
