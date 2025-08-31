# HyperEvents-js

A hypertext extension for the browser.

## About

`HyperEvents` enable HTML to declaratively:

- lazy-load esmodules
- query JSON APIs
- fetch html fragments
- dispatch action events (think redux actions)

This makes `HyperEvents` well-suited for SSR/SSG, template elements, and shadow DOM.

## Install

```html
npm install https://github.com/wolfpup-software/hyperevents-js
```

## Setup

Add a `target` and some `eventNames` on instantiation.

```ts
let _hyperEvents = new HyperEvents({
	target: document,
	connected: true,
	eventNames: ["click", "pointerover", "pointerdown", "input"],
});
```

## Events

Learn how to:

- dispatch [actions](./docs/action_events.md)
- import [esmodules](./docs/esmodule_events.md)
- query [JSON](./docs/json_events.md)
- fetch [html](./docs/html_events.md)

## Typescript

For typed events, please add the following to your app somewhere thoughtful.

```ts
import type {
	ActionEventInterface,
	EsModuleEventInterface,
	HtmlEventInterface,
	JsonEventInterface,
} from "hyperevents";

declare global {
	interface GlobalEventHandlersEventMap {
		["#action"]: ActionEventInterface;
		["#esmodule"]: EsModuleEventInterface;
		["#html"]: HtmlEventInterface;
		["#json"]: JsonEventInterface;
	}
}
```

## License

`HyperEvents-js` is released under the BSD 3-Clause License.
