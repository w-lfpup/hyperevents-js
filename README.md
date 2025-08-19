# HyperEvents-js

A hypertext extension for the browser.

## About

HyperEvents enable HTML to declaratively:

- query JSON APIs
- fetch html fragments
- lazy-load esmodules
- dispatch action events (think redux actions)

HyperEvents are an alternative to bulky frontend frameworks. Rather than bother with setup and teardown of specific callbacks on specific elements, DOM UI events create "action" events. Developers can listen and derive local state from action events.

This makes HyperEvents ideal for:

- SSR
- SSG
- HTML template elements
- Shadow DOM

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

## Actions

Action events connect DOM Events to local state.

Dsipatch actions with the following syntax:

```html
<button click:="update_something"></button>
```

Then listen for `#action` events in javascript-land.

```ts
document.addEventListener("#action", function (e: ActionEvent) {
	let { action, sourceEvent } = e.actionParams;
});
```

## ES Modules

Fetch esmodules using the following syntax:

```html
<div
	pointerover:="_esmodule"
	pointerover:url="/components/yet-another-button.js"
></div>
```

Then listen for request state with `#esmodule` events in javascript-land.

```ts
document.addEventListener("#esmodule", function (e: EsModuleEvent) {
	let { status, url } = e.requestState;
});
```

## JSON

Fetch and dispatch JSON using the following syntax:

```html
<span
	pointerdown:="_json"
	pointerdown:action="ping_api"
	pointerdown:url="/fetch/some.json"
></span>
```

Then listen for request state with `#json` events in javascript-land.

```ts
document.addEventListener("#json", function (e: JsonEvent) {
	let { requestState } = e;
	let { status } = requestState;

	if ("resolved" === status) {
		let { json } = requestState;
	}
});
```

## HTML

Fetch html using the following syntax:

```html
<input
	input:="_html"
	input:action="get_entries"
	input:url="/fetch/some.html"
>
```

Then listen for request state with `#html` events in javascript-land.

```ts
document.addEventListener("#html", function (e: HtmlEvent) {
	let { requestState } = e;
	let { status } = requestState;

	if ("resolved" === status) {
		let { html } = requestState;
	}
});
```

## Typescript

For typed events, please add the following to your app somewhere thoughtful.

```ts
import type {
	ActionEvent,
	HtmlEvent,
	JsonEvent,
	EsModuleEvent,
} from "hyperevents";

declare global {
	interface GlobalEventHandlersEventMap {
		["#action"]: ActionEvent;
		["#esmodule"]: EsModuleEvent;
		["#json"]: JsonEvent;
		["#html"]: HtmlEvent;
	}
}
```

## License

`HyperEvents-js` is released under the BSD 3-Clause License.
