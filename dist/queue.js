export class Queue {
    #inRoute;
    #inbound = [];
    #outbound = [];
    enqueue(atom) {
        this.#inbound.push(atom);
        atom.queued();
        if (!this.#inRoute)
            this.#queueAtom();
    }
    #queueAtom() {
        if (!this.#outbound.length) {
            while (this.#inbound.length) {
                let pip = this.#inbound.pop();
                if (pip)
                    this.#outbound.push(pip);
            }
        }
        this.#inRoute = this.#outbound.pop();
        this.#execAtom();
    }
    async #execAtom() {
        if (this.#inRoute) {
            await this.#inRoute.fetch();
            this.#queueAtom();
        }
    }
}
let queueMap = new Queue();
export function queued(dispatchParams, atom) {
    let { target, event, infix } = dispatchParams;
    let queueAttr = target.hasAttribute(`${event.type}${infix}queue`);
    if (queueAttr)
        window["$h-events"].queue.enqueue(atom);
    return queueAttr;
}
