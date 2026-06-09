# HyperEvents-js

A hypertext extension for the browser.

## About

HyperEvents enables HTML to:

- Query JSON APIs
- Fetch HTML fragments
- Lazy-load ESModules
- Dispatch redux-like actions
- Retrieve ArrayBuffers
- Throttle, queue, and debounce any of the above

It's all the frontend basics for frontend without all the cruft.

HyperEvents is built for the modern web (2026). It is ideal for server renders.

## Install

Install directly from github:

```bash
npm install https://github.com/w-lfpup/hyperevents-js
```

Install via npm:

```bash
npm install @w-lfpup/hyperevents
```

## Setup

Add a `target` and some `eventNames` on instantiation.

```ts
let _hyperEvents = new HyperEvents({
	host: document,
	connected: true,
	eventNames: ["click", "input", "pointerdown", "pointermove"],
});
```

## Action events

Dispatch actions with the following syntax:

```html
<button click:="update_something"></button>
```

Then listen for `#action` events in javascript-land.

```ts
document.addEventListener("#action", function (e: ActionEvent) {
	let { type, event, target, formData, status } = e.action;

	if ("queued" === status) {
	}
	if ("resolved" === status) {
	}
});
```

## Event behavior

A HyperEvent uses a familiar DOM event jargon to describe its behavior.

Below is a subset of the Event API reflected in hyperevent syntax:

```html
<button
	click:prevent-default
	click:stop-propagation
	click:stop-immediate-propagation
>
	hai :3!
</button>
```

## Throttle events

Any hyperevent can be throttled.

The example below below will throttle clicks on the `<button>` element every 500 ms under two conditions:
(1) the same hyperevent occured on (2) the same element.

```html
<section
	pointermove:="showcase_throttle"
	pointermove:throttle-ms="500">
</section>
```

## Debounce events

Any hyperevent can be debounced.

The example below below will debounce clicks on the `<button>` element every 500 ms under two conditions:
(1) the same hyperevent occured on (2) the same element.

```html
<input
	input:="showcase_debounce"
	input:debounce-ms="300">
```

## Queue events

Any hyperevent can be queued.

The example below will queue a hyperevent with the following syntax:

```html
<button
	click:="showcase_queue"
	click:queue>
</button>
```

## Fetch HTML

Fetch html using the following syntax:

```html
<input
	type="button"
	input:="_html"
	input:type="get_some_html"
	input:url="/fetch/some.html"
>
```

Then listen for request state with `#html` events in javascript-land.

```ts
document.addEventListener("#html", function (e: HtmlEvent) {
	let { requestState: rs } = e;

	if ("queued" === rs.status) {
	}
	if ("requested" === rs.status) {
	}
	if ("resolved" === rs.status) {
		let { html } = rs;
	}
	if ("rejected" === rs.status) {
	}
});
```

## Fetch JSON

Fetch and dispatch JSON using the following syntax:

```html
<span
	pointerdown:="_json"
	pointerdown:type="get_some_json"
	pointerdown:url="/ping/api.json">
</span>
```

Then listen for request state with `#json` events in javascript-land.

```ts
document.addEventListener("#json", function (e: JsonEvent) {
	let { requestState: rs } = e;

	if ("queued" === rs.status) {
	}
	if ("requested" === rs.status) {
	}
	if ("resolved" === rs.status) {
		let { json } = rs;
	}
	if ("rejected" === rs.status) {
	}
});
```

## Retrieve ArrayBuffers

Retrieve an array using the following syntax:

```html
<span
	pointerdown:="_arraybuffer"
	pointerdown:type="get_some_data"
	pointerdown:url="/ping/video/api">
</span>
```

Then listen for request state with `#json` events in javascript-land.

```ts
document.addEventListener("#arraybuffer", function (e: ArrayBufferEvent) {
	let { requestState: rs } = e;

	if ("queued" === rs.status) {
	}
	if ("requested" === rs.status) {
	}
	if ("resolved" === rs.status) {
		let { arrayBuffer } = rs;
	}
	if ("rejected" === rs.status) {
	}
});
```

## Import EsModules

Import EsModules using the following syntax:

```html
<div
	pointerover:="_esmodule"
	pointerover:url="/components/yet-another-button.js">
</div>
```

Then listen for request state with `#esmodule` events in javascript-land.

```ts
document.addEventListener("#esmodule", function (e: EsModuleEvent) {
	let { type, status, url } = e.requestState;

	if ("queued" === rs.status) {
	}
	if ("requested" === rs.status) {
	}
	if ("resolved" === rs.status) {
	}
	if ("rejected" === rs.status) {
	}
});
```

## Fetch behavior

Json, Html, ArrayBuffer requests are declared with the following attributes:

```html
<form
	submit:="_html"
	submit:url="get_some.html"
	submit:method="POST"
	submit:timeout-ms="2500"
	submit:prevent-default>
	<button type=submit>bark!</button>
</form>
```

## License

`HyperEvents-js` is released under the BSD 3-Clause License.
