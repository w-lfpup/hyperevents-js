export { ActionEvent } from "./action_event.js";
export { ESModuleEvent } from "./esmodule_event.js";
export { JsonEvent } from "./json_event.js";
export { HtmlEvent } from "./html_event.js";
import { dispatch } from "./dispatch.js";
export class SuperChunk {
    #params;
    constructor(params) {
        this.#params = params;
        if (this.#params.connected)
            this.connect();
    }
    connect() {
        let { target, eventNames } = this.#params;
        for (let name of eventNames) {
            target.addEventListener(name, dispatch);
        }
    }
    disconnect() {
        let { target, eventNames } = this.#params;
        for (let name of eventNames) {
            target.removeEventListener(name, dispatch);
        }
    }
}
