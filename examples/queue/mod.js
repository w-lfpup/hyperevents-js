import { HyperEvents } from "hyperevents";
const _hyperEvents = new HyperEvents({
    host: document,
    connected: true,
    eventNames: ["click"],
});
let ul = document.querySelector("ul");
document.addEventListener("#action", function (e) {
    console.log("action:", e);
    let { action } = e.dispatchParams;
    if ("clear_queue_list" === action) {
        ul?.replaceChildren();
    }
});
document.addEventListener("#html", function (e) {
    let { requestState: rs } = e;
    if ("queued" === rs.status) {
        let li = document.createElement("li");
        let p = document.createElement("p");
        p.textContent = `queued: ${rs.request.url}`;
        li.append(p);
        ul?.append(li);
    }
    if ("resolved" === rs.status) {
        console.log("resolved!", rs);
        let li = document.createElement("li");
        li.setHTMLUnsafe(rs.html);
        ul?.append(li);
    }
});
