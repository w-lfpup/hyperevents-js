export { dispatchHxRequest };






function dispatchHxRequestOnSubmit(e: Event): void {
	let { target } = e;
	let event = getHxRequestEventFromForm(target);
	if (event) {
		e.preventDefault();
		target.dispatchEvent(event);
		return;
	}
}

function getEventAttr(eventType: string) {
	return `__${eventType}`;
}

function getHxRequestEvent(
	e: Event,
	type: string,
	el: Element,
): Event | undefined {
	let action = el.getAttribute(type);
	
	if (action) return new HxRequestEvent(action, e);
}

function dispatchHxRequest(e: Event): void {
	let kind = getEventAttr(e.type);
	for (let node of e.composedPath()) {
		if (node instanceof Element) {
			let event = getHxRequestEvent(e, kind, node);
			if (node.hasAttribute(`${kind}_prevent-default_`)) e.preventDefault();
			if (event) node.dispatchEvent(event);
			if (node.hasAttribute(`${kind}_stop-propagation_`)) return;
		}
	}
}
