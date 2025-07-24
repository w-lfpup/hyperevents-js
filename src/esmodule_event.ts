import type { DispatchParams } from "./type_flyweight.js";

// this could explode so maybe blow up every 1024 elements or something
let set = new Set();

export function dispatchModuleEvent(params: DispatchParams) {
	let { el, type } = params;

	let urlAttr = el.getAttribute(`${type}:url`);
	if (urlAttr) {
		let url = new URL(urlAttr, location.href).toString();
		if (set.has(url)) return;
		set.add(url);

		import(url).catch(function () {
			set.delete(url);
		});
	}
}
