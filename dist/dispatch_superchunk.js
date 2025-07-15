/*
    Listends to DOM event.
    Reviews composed elements, the chain of elements in an event path.
    Dispatches correlated superchunk events:
    #action
    #html
    #esmodule
    #json


*/
export function dispatch(e) {
    console.log("howdy!", e);
}
