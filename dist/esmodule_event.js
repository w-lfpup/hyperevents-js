let urlSet = new Set();
export class ESModuleEvent extends Event {
    requestState;
    constructor(requestState, eventInitDict) {
        super("#esmodule", eventInitDict);
        this.requestState = requestState;
    }
}
export function dispatchModuleImport(params) {
    let { el, composed } = params;
    let urlAttr = el.getAttribute(`${params.sourceEvent.type}:url`);
    if (null === urlAttr)
        return;
    let url = new URL(urlAttr, location.href).toString();
    if (urlSet.has(url))
        return;
    urlSet.add(url);
    dispatchEvent({ status: "requested", url }, composed);
    import(url)
        .then(function () {
        dispatchEvent({ status: "resolved", url }, composed);
    })
        .catch(function (error) {
        urlSet.delete(url);
        dispatchEvent({ status: "rejected", url, error }, composed);
    });
}
function dispatchEvent(requestState, composed) {
    let event = new ESModuleEvent(requestState, { bubbles: true, composed });
    document.dispatchEvent(event);
}
