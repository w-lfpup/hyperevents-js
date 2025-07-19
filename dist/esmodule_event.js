const urlSet = new Set();
export function dispatchModuleEvent(el, kind) {
    let url = el.getAttribute(`${kind}:url`);
    if (url) {
        let updatedUrl = new URL(url, location.href).toString();
        if (urlSet.has(updatedUrl))
            return;
        import(updatedUrl)
            .then(function () {
            urlSet.add(updatedUrl);
        })
            .catch(function (reason) {
            console.log("esmodule error!", reason);
        });
    }
}
