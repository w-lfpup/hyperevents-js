let urlSet = new Set();
const eventInitDict = { bubbles: true, composed: true };
export class ESModuleEvent extends Event {
    results;
    constructor(results, eventInitDict) {
        super("#esmodule", eventInitDict);
        this.results = results;
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
    dispatchEvent({ url, status: "requested" });
    import(url)
        .then(function () {
        dispatchEvent({ url, status: "resolved" });
    })
        .catch(function () {
        urlSet.delete(url);
        dispatchEvent({ url, status: "rejected" });
    });
}
function dispatchEvent(results) {
    let event = new ESModuleEvent(results, eventInitDict);
    // only dispatch esmodule events from the document
    document.dispatchEvent(event);
}
