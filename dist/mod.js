export class SuperFetch {
    #params;
    constructor(params) {
        this.#params = params;
        if (this.#params.connected)
            this.connect();
    }
    connect() {
        let { host, eventNames } = this.#params;
        // for (let name of eventNames) {
        // 	host.addEventListener(name, dispatchSuperFetch);
        // }
        // addEventListener #fetch
        // addEventListener #response
        // addEventListener #projection
    }
    disconnect() {
        let { host, eventNames } = this.#params;
        // for (let name of eventNames) {
        // 	host.removeEventListener(name, dispatchSuperFetch);
        // }
        // removeEventListener #fetch
        // removeEventListener #response
        // removeEventListener #projection
    }
}
