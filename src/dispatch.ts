import type { DispatchParams } from "./type_flyweight.js";

import { dispatchActionEvent } from "./action_event.js";
import { dispatchJsonEvent } from "./json_event.js";
import { dispatchModuleImport } from "./esmodule_event.js";
import { dispatchHtmlEvent } from "./html_event.js";

export function dispatch(sourceEvent: Event) {
	let { type, currentTarget, target } = sourceEvent;

	let formData: FormData | undefined;
	if (target instanceof HTMLFormElement) formData = new FormData(target);

	for (let node of sourceEvent.composedPath()) {
		if (node instanceof Element) {
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

	if ("esmodule" === attr) return dispatchModuleImport(params);
	if ("json" === attr) return dispatchJsonEvent(params);
	if ("html" === attr) return dispatchHtmlEvent(params);

	return dispatchActionEvent(params);
}
