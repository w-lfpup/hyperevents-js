import { HyperEvents } from "hyperevents";
const _hyperEvents = new HyperEvents({
    host: document,
    connected: true,
    eventNames: ["click"],
});
let figure = document.querySelector("figure");
document.addEventListener("#html", function (e) {
    let { requestState: rs } = e;
    if ("resolved" === rs.status) {
        figure?.setHTMLUnsafe(rs.html);
    }
});
