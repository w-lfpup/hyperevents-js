import { HyperEvents } from "hyperevents";
const _hyperEvents = new HyperEvents({
    host: document,
    connected: true,
    eventNames: ["click"],
});
const ul = document.querySelector("ul");
document.addEventListener("#action", function (e) {
    let { timeStamp, type } = e.dispatchParams.originEvent;
    const li = document.createElement("li");
    li.textContent = `action occured at <${timeStamp.toFixed(2)}> on <${type}>`;
    ul?.append(li);
});
