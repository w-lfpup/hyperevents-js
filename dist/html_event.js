export function dispatchHtmlEvent(sourceEvent, el, kind) {
    let url = el.getAttribute(`${kind}:url`);
    if (url) {
        let req = new Request(url, {});
        fetch(req)
            .then(function (response) {
            return Promise.all([response, response.text()]);
        })
            .then(function ([res, htmlStr]) {
            console.log(htmlStr);
        })
            .catch(function (reason) {
            console.log("#json error!");
        });
    }
}
