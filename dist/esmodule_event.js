// this could explode so maybe blow up every 1024 elements or something
let set = new Set();
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
    if (urlAttr) {
        let url = new URL(urlAttr, location.href).toString();
        if (set.has(url))
            return;
        set.add(url);
        let event = new ESModuleEvent(url, "requested", { bubbles: true });
        document.dispatchEvent(event);
        import(url).then(function () {
            let event = new ESModuleEvent(url, "resolved", { bubbles: true });
            document.dispatchEvent(event);
        }).catch(function () {
            let event = new ESModuleEvent(url, "rejected", { bubbles: true });
            document.dispatchEvent(event);
            set.delete(url);
        });
    }
}
