// this could explode so maybe blow up every 1024 elements or something
let set = new Set();
export function dispatchModuleEvent(params) {
    let { el, sourceEvent } = params;
    let urlAttr = el.getAttribute(`${sourceEvent.type}:url`);
    if (urlAttr) {
        let url = new URL(urlAttr, location.href).toString();
        if (set.has(url))
            return;
        set.add(url);
        import(url).catch(function () {
            set.delete(url);
        });
    }
}
