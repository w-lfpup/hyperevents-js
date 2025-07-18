// const urlSet = new Set<string>();

export function dispatchModuleEvent(el: Element, kind: string) {
	let url = el.getAttribute(`${kind}:url`);

	if (url) {
		let updatedUrl = new URL(url, location.href).toString();

		// if (urlSet.has(updatedUrl)) return;

		import(updatedUrl)
			.then(function () {
				// urlSet.add(updatedUrl);
			})
			.catch(function (reason: any) {
				console.log("esmodule error!", reason);
			});
	}
}
