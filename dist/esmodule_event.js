import { queued } from "./queue.js";
let moduleMap = new Map();
export class EsModuleEvent extends Event {
    requestState;
    constructor(requestState, eventInitDict) {
        super("#esmodule", eventInitDict);
        this.requestState = requestState;
    }
}
export function dispatchEsModuleEvent(dispatchParams) {
    let { el, target, composed, sourceEvent } = dispatchParams;
    let urlAttr = el.getAttribute(`${sourceEvent.type}:url`);
    if (null === urlAttr)
        return;
    let url = new URL(urlAttr, location.href).toString();
    let moduleState = moduleMap.get(url);
    if (moduleState) {
        let { status } = moduleState;
        if ("resolved" === status)
            queueUpdate(el, sourceEvent);
        return;
    }
    let requested = { status: "requested", url };
    moduleMap.set(url, requested);
    let importParams = getImportParams(dispatchParams);
    if (!importParams)
        return;
    let moduleImport = new EsModuleImport(dispatchParams, importParams);
    if (queued(dispatchParams, moduleImport))
        return;
    moduleImport.fetch();
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
        let event = new EsModuleEvent({ status: "queued", ...this.#importParams }, { bubbles: true, composed });
        target.dispatchEvent(event);
    }
    fetch() {
        return importEsModule(this.#dispatchParams, this.#importParams);
    }
}
function getImportParams(dispatchParams) {
    let { el, sourceEvent } = dispatchParams;
    let { type } = sourceEvent;
    let url = el.getAttribute(`${type}:url`);
    if (!url)
        return;
    return {
        url,
    };
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
        queueUpdate(el, sourceEvent);
        let event = new EsModuleEvent(resolved, { bubbles: true, composed });
        target.dispatchEvent(event);
    })
        .catch(function (error) {
        moduleMap.delete(url);
        let event = new EsModuleEvent({ status: "rejected", url, error }, { bubbles: true, composed });
        target.dispatchEvent(event);
    });
}
function queueUpdate(el, sourceEvent) {
    queueMicrotask(function () {
        el.setAttribute(`${sourceEvent.type}:`, "_esmodule_resolved");
    });
}
