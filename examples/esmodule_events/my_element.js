"use strict";
class MyElement extends HTMLElement {
    #sd = this.attachShadow({ mode: "closed" });
    constructor() {
        super();
        this.#sd.appendChild(document.createTextNode("An esmodule has now defined this element!"));
    }
}
customElements.define("my-element", MyElement);
