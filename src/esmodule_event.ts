// this could explode so maybe blow up every 1024 elements or something
let set = new Set();

export function dispatchModuleEvent(el: Element, kind: string) {
	let url = el.getAttribute(`${kind}:url`);
	if (url) {
		let updatedUrl = new URL(url, location.href).toString();
		if (set.has(updatedUrl)) return;
		set.add(updatedUrl);

		import(updatedUrl).catch(function () {
			set.delete(updatedUrl);
		});
	}
}
