"use strict";
class BearEl extends HTMLElement {
    #sd = this.attachShadow({ mode: "closed" });
    constructor() {
        super();
        this.#sd.appendChild(document.createTextNode("raaawwww"));
    }
}
customElements.define("bear-el", BearEl);
