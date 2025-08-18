let urlSet = new Set();
export class EsModuleEvent extends Event {
    requestState;
    constructor(requestState, eventInitDict) {
        super("#esmodule", eventInitDict);
        this.requestState = requestState;
    }
}
export function dispatchEsModuleEvent(params) {
    let { el, composed } = params;
    let urlAttr = el.getAttribute(`${params.sourceEvent.type}:url`);
    if (null === urlAttr)
        return;
    let url = new URL(urlAttr, location.href).toString();
    if (urlSet.has(url))
        return;
    urlSet.add(url);
    let event = new EsModuleEvent({ status: "requested", url }, { bubbles: true, composed });
    el.dispatchEvent(event);
    import(url)
        .then(function () {
        let event = new EsModuleEvent({ status: "resolved", url }, { bubbles: true, composed });
        el.dispatchEvent(event);
    })
        .catch(function (error) {
        urlSet.delete(url);
        let event = new EsModuleEvent({ status: "rejected", url, error }, { bubbles: true, composed });
        el.dispatchEvent(event);
    });
}
