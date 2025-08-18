let urlSet = new Set();
export class ESModuleEvent extends Event {
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
    dispatchEvent({ status: "requested", url }, el, composed);
    import(url)
        .then(function () {
        dispatchEvent({ status: "resolved", url }, el, composed);
    })
        .catch(function (error) {
        urlSet.delete(url);
        dispatchEvent({ status: "rejected", url, error }, el, composed);
    });
}
function dispatchEvent(requestState, target, composed) {
    let event = new ESModuleEvent(requestState, { bubbles: true, composed });
    target.dispatchEvent(event);
}
