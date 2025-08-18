import { dispatchActionEvent } from "./action_event.js";
import { dispatchEsModuleEvent } from "./esmodule_event.js";
import { dispatchJsonEvent } from "./json_event.js";
import { dispatchHtmlEvent } from "./html_event.js";
export function dispatch(sourceEvent) {
    let { type, currentTarget, target } = sourceEvent;
    if (!currentTarget)
        return;
    let formData;
    if (target instanceof HTMLFormElement)
        formData = new FormData(target);
    for (let node of sourceEvent.composedPath()) {
        if (node instanceof Element) {
            let kind = node.getAttribute(`${sourceEvent.type}:`);
            if (!kind)
                continue;
            if (node.hasAttribute(`${type}:prevent-default`))
                sourceEvent.preventDefault();
            if (node.hasAttribute(`${type}:stop-immediate-propagation`))
                return;
            let composed = node.hasAttribute(`${type}:composed`);
            dispatchEvent({
                el: node,
                kind,
                currentTarget,
                sourceEvent,
                composed,
                formData,
            });
            if (node.hasAttribute(`${type}:stop-propagation`))
                return;
        }
    }
}
function dispatchEvent(params) {
    let { kind } = params;
    if ("_esmodule" === kind)
        return dispatchEsModuleEvent(params);
    if ("_json" === kind)
        return dispatchJsonEvent(params);
    if ("_html" === kind)
        return dispatchHtmlEvent(params);
    return dispatchActionEvent(params);
}
