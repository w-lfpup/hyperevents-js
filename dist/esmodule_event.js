let urlSet = new Set();
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
        if ("resolved" === status) {
            el.setAttribute(`${sourceEvent.type}:`, "_esmodule_resolved");
        }
        return;
    }
    let requested = { status: "requested", url };
    moduleMap.set(url, requested);
    let event = new EsModuleEvent(requested, { bubbles: true, composed });
    target.dispatchEvent(event);
    import(url)
        .then(function () {
        let resolved = { status: "resolved", url };
        let event = new EsModuleEvent(resolved, { bubbles: true, composed });
        el.setAttribute(`${sourceEvent.type}:`, "_esmodule_resolved");
        moduleMap.set(url, resolved);
        target.dispatchEvent(event);
    })
        .catch(function (error) {
        urlSet.delete(url);
        let event = new EsModuleEvent({ status: "rejected", url, error }, { bubbles: true, composed });
        target.dispatchEvent(event);
    });
}
class EsModuleImport {
    #dispatchParams;
    #fetchParams;
    constructor(dispatchParams, fetchParams) {
        this.#dispatchParams = dispatchParams;
        this.#fetchParams = fetchParams;
    }
    dispatchQueueEvent() {
        let { target, composed } = this.#dispatchParams;
        let event = new EsModuleEvent({ status: "queued", ...this.#fetchParams }, { bubbles: true, composed });
        target.dispatchEvent(event);
    }
    fetch() {
        return importEsModule(this.#dispatchParams, this.#fetchParams);
    }
}
export function createFetchParams(dispatchParams) {
    let requestParams = getImportParams(dispatchParams);
    if (!requestParams)
        return;
    let abortController = new AbortController();
    let { action } = requestParams;
    let request = createRequest(dispatchParams, requestParams, abortController);
    return {
        action,
        request,
        abortController,
    };
}
function getImportParams(dispatchParams) {
    let { el, sourceEvent } = dispatchParams;
    let { type } = sourceEvent;
    let url = el.getAttribute(`${type}:url`);
    if (!url)
        return;
    let timeoutMsAttr = el.getAttribute(`${type}:timeout-ms`);
    let timeoutMs = parseInt(timeoutMsAttr ?? "");
    return {
        timeoutMs: Number.isNaN(timeoutMs) ? undefined : timeoutMs,
        url,
    };
}
function importEsModule(dispatchParams, fetchParams) {
    let { url, abortController } = fetchParams;
    if (abortController.signal.aborted)
        return;
    let { el, target, composed, sourceEvent } = dispatchParams;
    let event = new EsModuleEvent({ status: "requested", url }, { bubbles: true, composed });
    target.dispatchEvent(event);
    import(url)
        .then(function () {
        let event = new EsModuleEvent({ status: "resolved", url }, { bubbles: true, composed });
        el.setAttribute(`${sourceEvent.type}:`, "_esmodule_resolved");
        target.dispatchEvent(event);
    })
        .catch(function (error) {
        urlSet.delete(url);
        let event = new EsModuleEvent({ status: "rejected", url, error }, { bubbles: true, composed });
        target.dispatchEvent(event);
    });
}
