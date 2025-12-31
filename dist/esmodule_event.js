import { queued } from "./queue.js";
let moduleMap = new Map();
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
    dispatchQueueEvent() {
        let { target, composed } = this.#dispatchParams;
        let moduleQueued = {
            status: "queued",
            ...this.#importParams,
        };
        let { url } = this.#importParams;
        moduleMap.set(url, moduleQueued);
        let event = new EsModuleEvent(moduleQueued, { bubbles: true, composed });
        target.dispatchEvent(event);
    }
    fetch() {
        return importEsModule(this.#dispatchParams, this.#importParams);
    }
}
export function dispatchEsModuleEvent(dispatchParams) {
    let { el, sourceEvent } = dispatchParams;
    let urlAttr = el.getAttribute(`${sourceEvent.type}:url`);
    if (null === urlAttr)
        return;
    let url = new URL(urlAttr, location.href).toString();
    let moduleState = moduleMap.get(url);
    if (moduleState) {
        let { status } = moduleState;
        if ("resolved" === status)
            queueUpdateAsResolved(el, sourceEvent);
        if ("rejected" !== status)
            return;
    }
    let moduleImport = new EsModuleImport(dispatchParams, { url });
    if (queued(dispatchParams, moduleImport))
        return;
    moduleImport.fetch();
}
function importEsModule(dispatchParams, esImportParams) {
    let { url } = esImportParams;
    let requested = { status: "requested", url };
    moduleMap.set(url, requested);
    let { el, target, composed, sourceEvent } = dispatchParams;
    let event = new EsModuleEvent(requested, { bubbles: true, composed });
    target.dispatchEvent(event);
    return import(url)
        .then(function () {
        let resolved = { status: "resolved", url };
        moduleMap.set(url, resolved);
        let event = new EsModuleEvent(resolved, { bubbles: true, composed });
        target.dispatchEvent(event);
        queueUpdateAsResolved(el, sourceEvent);
    })
        .catch(function (error) {
        moduleMap.delete(url);
        let event = new EsModuleEvent({ status: "rejected", url, error }, { bubbles: true, composed });
        target.dispatchEvent(event);
    });
}
function queueUpdateAsResolved(el, sourceEvent) {
    queueMicrotask(function () {
        el.setAttribute(`${sourceEvent.type}:`, "_esmodule_resolved");
    });
}
