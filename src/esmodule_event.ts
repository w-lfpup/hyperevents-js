export function dispatchModuleEvent(el: Element, kind: string) {
	let url = el.getAttribute(`${kind}:url`);

	if (url) {
		let updatedUrl = new URL(url, location.href);

		import(updatedUrl.toString()).catch(function (reason: any) {
			console.log("esmodule error!", reason);
		});
	}
}
