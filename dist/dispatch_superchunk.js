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
export function dispatch(e) {
    let { type } = e;
    for (let node of e.composedPath()) {
        if (node instanceof Element) {
            // also get source node?
            let event = getEvent(node, type);
            if (node.hasAttribute(`${type}:prevent-default`))
                e.preventDefault();
            if (event)
                node.dispatchEvent(event);
            if (node.hasAttribute(`${type}:stop-propagation`))
                return;
        }
    }
}
function getEvent(el, type) {
    let attr = el.getAttribute(`${type}:`);
    // load html fragments
    if ("#html" === attr) { }
    if ("#esmodule" === attr) { }
    // these two the user reacts to
    if ("#json" === attr) { }
    // action events
    if ("#action" === attr) {
        return getActionEvent(el, type);
    }
    return getFallbackAction(el, attr);
}
