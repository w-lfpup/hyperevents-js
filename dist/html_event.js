// asynchronous
// queue-able
export function dispatchHtmlEvent(el, kind) {
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
            console.log("#html error!");
        });
    }
}
