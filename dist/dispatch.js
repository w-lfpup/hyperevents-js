/*
    Listends to DOM event.
    Reviews composed elements, the chain of elements in an event path.
    Dispatches correlated superchunk events:
    
    #action
    #html
    #esmodule
    #json
*/
import { getActionEvent } from "./action_event.js";
import { dispatchJsonEvent } from "./json_event.js";
import { dispatchModuleEvent } from "./esmodule_event.js";
import { dispatchHtmlEvent } from "./html_event.js";
export function dispatch(sourceEvent) {
    let { type, currentTarget } = sourceEvent;
    for (let node of sourceEvent.composedPath()) {
        if (node instanceof Element) {
            // also get source node?
            if (node.hasAttribute(`${type}:prevent-default`))
                sourceEvent.preventDefault();
            dispatchEvent({ el: node, currentTarget, sourceEvent });
            if (node.hasAttribute(`${type}:stop-propagation`))
                return;
        }
    }
}
function dispatchEvent(params) {
    let { el, sourceEvent } = params;
    let attr = el.getAttribute(`${sourceEvent.type}:`);
    // load html fragments
    if ("html" === attr)
        return dispatchHtmlEvent(params);
    if ("esmodule" === attr)
        return dispatchModuleEvent(params);
    // these two the user reacts to
    if ("json" === attr)
        return dispatchJsonEvent(params);
    // action events
    return getActionEvent(params);
}
