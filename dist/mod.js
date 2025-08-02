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
        let { host, eventNames } = this.#params;
        for (let name of eventNames) {
            host.addEventListener(name, dispatch);
        }
    }
    disconnect() {
        let { host, eventNames } = this.#params;
        for (let name of eventNames) {
            host.removeEventListener(name, dispatch);
        }
    }
}
