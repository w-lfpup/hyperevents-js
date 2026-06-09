let moduleMap = new Set();
export class EsModuleEvent extends Event {
    requestState;
    constructor(requestState, eventInitDict) {
        super("#esmodule", eventInitDict);
        this.requestState = requestState;
    }
}
class EsModuleImport {
    #dispatchParams;
    #importParams;
    constructor(dispatchParams, importParams) {
        this.#dispatchParams = dispatchParams;
        this.#importParams = importParams;
    }
    queued() {
        let event = new EsModuleEvent({
            status: "queued",
            ...this.#importParams,
        });
        document.dispatchEvent(event);
    }
    fetch() {
        return importEsModule(this.#dispatchParams, this.#importParams);
    }
}
export function composeEsModule(dispatchParams) {
    let { target, dispatchTarget, event, abortController } = dispatchParams;
    let urlAttr = target.getAttribute(`${event.type}:url`);
    if (null === urlAttr)
        return;
    let url = new URL(urlAttr, location.href).toString();
    if (window["$h-events"].modules.has(url))
        return;
    window["$h-events"].modules.add(url);
    return new EsModuleImport(dispatchParams, {
        url,
        dispatchTarget,
        event,
    });
}
function importEsModule(dispatchParams, esImportParams) {
    if (dispatchParams.abortController?.signal.aborted)
        return;
    let { url } = esImportParams;
    let esmoduleEvent = new EsModuleEvent({ status: "requested", url });
    document.dispatchEvent(esmoduleEvent);
    return import(url)
        .then(function () {
        let esmoduleEvent = new EsModuleEvent({
            status: "resolved",
            url,
        });
        document.dispatchEvent(esmoduleEvent);
    })
        .catch(function (error) {
        window["$h-events"].modules.delete(url);
        let esmoduleEvent = new EsModuleEvent({
            status: "rejected",
            url,
            error,
        });
        document.dispatchEvent(esmoduleEvent);
    });
}
