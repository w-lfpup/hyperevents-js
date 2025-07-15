
// export { dispatchRequestEvemt };

// class SuperRequestEvent extends Event implements SuperRequestEvent {
// 	#action: string;
// 	#sourceEvent: Event;

// 	constructor(action: string, sourceEvent: Event) {
// 		super("#action", { bubbles: true, composed: true });

// 		this.#action = action;
// 		this.#sourceEvent = sourceEvent;
// 	}

// 	get action(): string {
// 		return this.#action;
// 	}

// 	get sourceEvent(): Event {
// 		return this.#sourceEvent;
// 	}
// }

// function getHxRequestEvent(eventTarget: HTMLAnchorElement): Event {
// 	if (
// 		eventTarget instanceof HTMLAnchorElement &&
// 		eventTarget.hasAttribute("_projection")
// 	) {
// 		return new Event("#request", {
// 			bubbles: true,
// 			composed: true,
// 		});
// 	}
// }

// function dispatchRequestEvent(e: Event): void {
// 	let kind = getEventAttr(e.type);
// 	for (let node of e.composedPath()) {
// 		if (node instanceof Element) {
// 			let event = getRequestEvent(e, kind, node);
// 			if (node.hasAttribute(`${kind}_prevent-default`)) e.preventDefault();
// 			if (event) node.dispatchEvent(event);
// 			if (node.hasAttribute(`${kind}_stop-propagation`)) return;
// 		}
// 	}
// }

// function getEventAttr(eventType: string) {
// 	return `__${eventType}`;
// }

// function getRequestEvent(
// 	e: Event,
// 	type: string,
// 	el: Element,
// ): Event | undefined {
// 	let action = el.getAttribute(type);
// 	if (action) return new SuperActionEvent(action, e);
// }
