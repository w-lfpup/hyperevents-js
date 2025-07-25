/*
    Listends to DOM event.
    Reviews composed elements, the chain of elements in an event path.
    Dispatches correlated superchunk events:
	
    #action
    #html
    #esmodule
    #json
*/

import type { DispatchParams } from "./type_flyweight.js";

import { dispatchActionEvent } from "./action_event.js";
import { dispatchJsonEvent } from "./json_event.js";
import { dispatchModuleEvent } from "./esmodule_event.js";
import { dispatchHtmlEvent } from "./html_event.js";

export function dispatch(sourceEvent: Event) {
	let { type, currentTarget, target } = sourceEvent;

	let formData: FormData | undefined;
	if (target instanceof HTMLFormElement) formData = new FormData(target);

	for (let node of sourceEvent.composedPath()) {
		if (node instanceof Element) {
			// also get source node?
			if (node.hasAttribute(`${type}:prevent-default`))
				sourceEvent.preventDefault();

			dispatchEvent({ el: node, currentTarget, sourceEvent, formData });

			if (node.hasAttribute(`${type}:stop-propagation`)) return;
		}
	}
}

function dispatchEvent(params: DispatchParams) {
	let { el, sourceEvent } = params;

	let attr = el.getAttribute(`${sourceEvent.type}:`);

	if ("html" === attr) return dispatchHtmlEvent(params);
	if ("esmodule" === attr) return dispatchModuleEvent(params);
	if ("json" === attr) return dispatchJsonEvent(params);

	return dispatchActionEvent(params);
}
