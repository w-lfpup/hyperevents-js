"use strict";
class CopperheadEl extends HTMLElement {
    #sd = this.attachShadow({ mode: "closed" });
    constructor() {
        super();
        this.#sd.appendChild(document.createTextNode("sssaaaaa"));
    }
}
customElements.define("copperhead-el", CopperheadEl);
