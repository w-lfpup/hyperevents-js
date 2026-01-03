import { HyperEvents } from "hyperevents";
const _hyperEvents = new HyperEvents({
    host: document,
    connected: true,
    eventNames: ["click"],
});
document.addEventListener("#html", function (e) {
    console.log("#html", e.requestState);
    let { requestState: rs } = e;
    if ("update_showcase" === rs.action && "resolved" === rs.status) {
        let template = document.createElement("template");
        template.setHTMLUnsafe(rs.html);
    }
});
