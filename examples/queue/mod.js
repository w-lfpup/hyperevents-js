import { HyperEvents } from "hyperevents";
const _hyperEvents = new HyperEvents({
    host: document,
    connected: true,
    eventNames: ["click"],
});
let ul = document.querySelector("ul");
document.addEventListener("#html", function (e) {
    let { requestState: rs } = e;
    if ("queued" === rs.status) {
        let p = document.createElement("p");
        p.textContent = `queued: ${rs.url}`;
        let li = document.createElement("li");
        li.append(p);
        ul?.append(li);
    }
    if ("resolved" === rs.status) {
        let li = document.createElement("li");
        li.setHTMLUnsafe(rs.html);
        ul?.append(li);
    }
});
