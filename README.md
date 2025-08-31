# HyperEvents-js

A hypertext extension for the browser.

## About

`HyperEvents` enable HTML to declaratively:

- query JSON APIs
- fetch html fragments
- lazy-load esmodules
- dispatch action events (think redux actions)

This makes `HyperEvents` well-suited for:

- SSR
- SSG
- Templates and shadow DOM

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

`HyperEvents` enable HTML to declaratively:

- query [JSON](./docs/json_events.md) APIs
- fetch [html](./docs/html_events.md) fragments
- lazy-load [esmodules](./docs/esmodule_events.md)
- dispatch [actions](./docs/action_events.md) events (think redux actions)

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
