# HyperEvents-js

A hypertext extension for the browser.

## About

HyperEvents enables HTML to:

- Throttle, queue, and debounce events
- Query JSON APIs
- Fetch HTML fragments
- Lazy-load ESModules
- Dispatch redux-like actions
- Retrieve ArrayBuffers

It's all the requirements of serious frontend without all the callbacks and cruft.

HyperEvents is built for the modern web (2026). It is ideal for server AND client renders.

## Install

Install via npm:

```bash
npm install @w-lfpup/hyperevents
```

Or directly from github:

```bash
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

## Action events

Dispatch actions with the following syntax:

```html
<button click:="update_something"></button>
```

Then listen for `#action` events in javascript-land.

```ts
document.addEventListener("#action", function (e: ActionEvent) {
	let { type, event, target, formData } = e.action;
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

All hyperevents, except action events, can be queued with the following syntax:

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

## Fetch JSON

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

## Fetch behavior

JSON and HTML requests are declared with the following attributes:

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

If any form is involed in the original DOM `event`, the correlated form data is sent as the request body.

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
});
```

## License

`HyperEvents-js` is released under the BSD 3-Clause License.
