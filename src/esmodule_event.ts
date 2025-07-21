// Unless there's no reason for a set?
// Or there's a broader esmodule map?

// should this be queable and throttle-able?
// It's mainly for loading interactivity, a new slice of state, a webcomponent.

// Gut feeling says this should NOT be queue-able or throttle-able
// Let the browser handle it or only

let set = new Set();

export function dispatchModuleEvent(el: Element, kind: string) {
	let url = el.getAttribute(`${kind}:url`);
	if (url) {
		let updatedUrl = new URL(url, location.href).toString();
		if (set.has(updatedUrl)) return;
		set.add(updatedUrl);

		import(updatedUrl).catch(function (reason: any) {
			set.delete(updatedUrl);
			console.log("esmodule error!", reason);
		});
	}
}
