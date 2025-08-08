let urlSet = new Set();
const eventInitDict = { bubbles: true, composed: true };
export class ESModuleEvent extends Event {
    requestState;
    constructor(requestState, eventInitDict) {
        super("#esmodule", eventInitDict);
        this.requestState = requestState;
    }
}
export function dispatchModuleImport(params) {
    let { el, sourceEvent } = params;
    let urlAttr = el.getAttribute(`${sourceEvent.type}:url`);
    if (null === urlAttr)
        return;
    let url = new URL(urlAttr, location.href).toString();
    if (urlSet.has(url))
        return;
    urlSet.add(url);
    dispatchEvent({ status: "requested", url });
    import(url)
        .then(function () {
        dispatchEvent({ status: "resolved", url });
    })
        .catch(function (error) {
        urlSet.delete(url);
        dispatchEvent({ status: "rejected", url, error });
    });
}
function dispatchEvent(status) {
    let event = new ESModuleEvent(status, eventInitDict);
    document.dispatchEvent(event);
}
