/*
    Listends to DOM event.
    Reviews composed elements, the chain of elements in an event path.
    Dispatches correlated superchunk events:
    #action
    #html
    #esmodule
    #json
*/

import { getActionEvent, getFallbackAction } from "./action_event.js";
import { dispatchJsonEvent } from "./json_event.js";

export function dispatch(e: Event) {
	let { type } = e;

	for (let node of e.composedPath()) {
		if (node instanceof Element) {
			// also get source node?
			if (node.hasAttribute(`${type}:prevent-default`)) e.preventDefault();
			let event = dispatchEvent(e, node, type);
			if (event) node.dispatchEvent(event);
			if (node.hasAttribute(`${type}:stop-propagation`)) return;
		}
	}
}

function dispatchEvent(sourceEvent: Event, el: Element, type: string) {
	let attr = el.getAttribute(`${type}:`);

	// load html fragments
	if ("#html" === attr) {
	}
	if ("#esmodule" === attr) {
	}
	// these two the user reacts to
	if ("#json" === attr) {
		return dispatchJsonEvent(el, type);
	}

	// action events
	if ("#action" === attr) {
		return getActionEvent(sourceEvent, el, type);
	}

	return getFallbackAction(sourceEvent, el, attr);
}
