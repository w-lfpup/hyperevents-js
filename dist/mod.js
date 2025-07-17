import { dispatch } from "./dispatch_superchunk.js";
export { ActionEvent } from "./action_event.js";
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
