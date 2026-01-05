class MyElement extends HTMLElement {
	#sd = this.attachShadow({ mode: "closed" });

	constructor() {
		super();

		this.#sd.appendChild(
			document.createTextNode("The my-element component is now defined!"),
		);
	}
}

customElements.define("my-element", MyElement);
