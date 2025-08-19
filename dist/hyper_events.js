import { dispatch } from "./dispatch.js";
export class HyperEvents {
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
