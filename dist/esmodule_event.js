export function dispatchModuleEvent(el, kind) {
    let url = el.getAttribute(`${kind}:url`);
    if (url) {
        let updatedUrl = new URL(url, location.href);
        import(updatedUrl.toString()).catch(function (reason) {
            console.log("esmodule error!", reason);
        });
    }
}
