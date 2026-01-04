"use strict";
class WolfEl extends HTMLElement {
    #sd = this.attachShadow({ mode: "closed" });
    constructor() {
        super();
        this.#sd.appendChild(document.createTextNode("arrroooo"));
    }
}
customElements.define("wolf-el", WolfEl);
