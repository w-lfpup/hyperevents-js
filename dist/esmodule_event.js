let set = new Set();
const eventInitDict = { bubbles: true, composed: true };
class ESModuleEvent extends Event {
    #url;
    #status;
    constructor(url, status, eventInitDict) {
        super("#esmodule", eventInitDict);
        this.#url = url;
        this.#status = status;
    }
    get urlStr() {
        return this.#url;
    }
    get status() {
        return this.#status;
    }
}
export function dispatchModuleImport(params) {
    let { el, sourceEvent } = params;
    let urlAttr = el.getAttribute(`${sourceEvent.type}:url`);
    if (null === urlAttr)
        return;
    let url = new URL(urlAttr, location.href).toString();
    if (set.has(url))
        return;
    set.add(url);
    // need a memory address for weak maps
    let event = new ESModuleEvent(url, "requested", eventInitDict);
    document.dispatchEvent(event);
    import(url)
        .then(function () {
        let event = new ESModuleEvent(url, "resolved", eventInitDict);
        document.dispatchEvent(event);
    })
        .catch(function () {
        set.delete(url);
        let event = new ESModuleEvent(url, "rejected", eventInitDict);
        document.dispatchEvent(event);
    });
}
