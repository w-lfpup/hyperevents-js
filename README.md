# HyperEvents-js

A hypertext extension for the browser.

## About

HyperEvents enables HTML to declaratively:

- dispatch meaningful actions
- query JSON APIs
- fetch html fragments
- lazy-load esmodules
- throttle events
- queue (and order) events

HyperEvents is built for modern web standards making it ideal for:

- SSR
- SSG
- HTML template elements
- Declarative shadow DOM

## Install

```html
npm install https://github.com/wolfpup-software/hyperevents-js
```

## Setup

Add a `target` and some `eventNames` on instantiation.

```ts
let _hyperEvents = new HyperEvents({
	host: document,
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
	let { action, originEvent } = e.actionParams;
});
```

## Event behavior

HyperEvents leapfrog familiar DOM event jargon to describe the behavior of an action event. These ancillary attributes behave exactly as their DOM event counterparts.

Below is an example of a subset of the Event API reflected in hyperevent syntax:

```html
<button
	click:="update_something"
	click:composed
	click:once
	click:prevent-default
	click:stop-immediate-propagation
	click:stop-propagation>
	hai :3!
</button>
```

Other ancillary attributes can throttle and queue hyperevents:

```html
<button click:throttle-ms="500" click:queue></button>
```

## ES Modules

Fetch esmodules using the following syntax:

```html
<div
	pointerover:="_esmodule"
	pointerover:url="/components/yet-another-button.js">
</div>
```

Then listen for request state with `#esmodule` events in javascript-land.

```ts
document.addEventListener("#esmodule", function (e: EsModuleEvent) {
	let { status, url } = e.requestState;
});
```

## HTML

Fetch html using the following syntax:

```html
<input
	type="button"
	input:="_html"
	input:url="/fetch/some.html"
>
```

Then listen for request state with `#html` events in javascript-land.

```ts
document.addEventListener("#html", function (e: HtmlEvent) {
	let { requestState: rs } = e;

	if ("resolved" === rs.status) {
		let { html } = rs;
	}
});
```

## JSON

Fetch and dispatch JSON using the following syntax:

```html
<span
	pointerdown:="_json"
	pointerdown:url="/ping/api.json">
</span>
```

Then listen for request state with `#json` events in javascript-land.

```ts
document.addEventListener("#json", function (e: JsonEvent) {
	let { requestState: rs } = e;

	if ("resolved" === rs.status) {
		let { json } = rs;
	}
});
```

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
