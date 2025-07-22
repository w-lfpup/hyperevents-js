let set = new Set();

export function dispatchModuleEvent(el: Element, kind: string) {
	let url = el.getAttribute(`${kind}:url`);
	if (url) {
		let updatedUrl = new URL(url, location.href).toString();
		if (set.has(updatedUrl)) return;
		set.add(updatedUrl);

		import(updatedUrl).catch(function (_reason: any) {
			set.delete(updatedUrl);
		});
	}
}
