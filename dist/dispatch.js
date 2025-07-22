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
export function dispatch(e) {
    let { type } = e;
    for (let node of e.composedPath()) {
        if (node instanceof Element) {
            // also get source node?
            if (node.hasAttribute(`${type}:prevent-default`))
                e.preventDefault();
            dispatchEvent(e, e.currentTarget, node, type);
            if (node.hasAttribute(`${type}:stop-propagation`))
                return;
        }
    }
}
function dispatchEvent(sourceEvent, currentTarget, el, type) {
    let attr = el.getAttribute(`${type}:`);
    // load html fragments
    if ("html" === attr) {
        return dispatchHtmlEvent(el, currentTarget, type);
    }
    if ("esmodule" === attr) {
        return dispatchModuleEvent(el, type);
    }
    // these two the user reacts to
    if ("json" === attr) {
        return dispatchJsonEvent(el, currentTarget, type);
    }
    // action events
    return getActionEvent(sourceEvent, currentTarget, el, type);
}
