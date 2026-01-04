"use strict";
class CrowEl extends HTMLElement {
    #sd = this.attachShadow({ mode: "closed" });
    constructor() {
        super();
        this.#sd.appendChild(document.createTextNode("caaaawww"));
    }
}
customElements.define("crow-el", CrowEl);
