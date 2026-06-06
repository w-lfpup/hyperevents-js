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

Dsipatch an action to with the following syntax to connect a UI Event to local state:

```html
<button click:="update_something"></button>
```

Then listen for `#action` events in javascript-land.

```ts
document.addEventListener("#action", function (e: ActionEvent) {
	let { type, originEvent } = e.action;
});
```

## ESModule events

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
	let { type, status, url } = e.requestState;
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

## Event behavior

HyperEvents leapfrog familiar DOM event jargon to describe the behavior of an action event. These ancillary attributes behave exactly as their DOM event counterparts.

Below is an example of a subset of the Event API reflected in hyperevent syntax:

```html
<button
	click:prevent-default
	click:stop-immediate-propagation
	click:stop-propagation
>
	hai :3!
</button>
```

All of the attributes mentioned above are valid for any hyperevent.

## Request behavior

JSON and HTML events can declare with using the following attributes:

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

If any form is involed in the `originEvent`, the correlated form data is sent as the request body.

## Throttle events

Any hyperevent can be throttled.

The example below below will throttle clicks on the `<button>` element every 500 ms under two conditions:
(1) the same hyperevent occured on (2) the same element.

```html
<button
	click:="showcase_throttle"
	click:throttle-ms="500">
</button>
```

## Debounce events

Any hyperevent can be debounced.

The example below below will debounce clicks on the `<button>` element every 500 ms under two conditions:
(1) the same hyperevent occured on (2) the same element.

```html
<button
	click:="showcase_throttle"
	click:debounce-ms="300">
</button>
```

## Queue events

All hyperevents, except action events, can be queued with the following syntax:

```html
<button
	click:="_html"
	click:url="./get_some.html"
	click:queue>
</button>
```

## License

`HyperEvents-js` is released under the BSD 3-Clause License.
