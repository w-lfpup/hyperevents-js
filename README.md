# HyperActions-js

A hypertext extension for the browser.

## About

HyperActions enable HTML to declaratively:

- query JSON APIs
- fetch html fragments
- lazy-load esmodules
- dispatch action events (think redux actions)

HyperActions are an alternative to bulky frontend frameworks. Rather than bother with setup and teardown of specific callbacks on specific elements, DOM UI events create "action" events. Developers can listen and derive local state from action events.

This makes HyperActions ideal for:

- SSR
- SSG
- HTML template elements
- Shadow DOM

## Install

```html
npm install https://github.com/wolfpup-software/hyperactions-js
```

## Setup

Add a `target` and some `eventNames` on instantiation.

```ts
let bang = new HyperActions({
	target: document,
	connected: true,
	eventNames: ["click", "pointerover"],
});
```

## Actions

Action events connect DOM Events to local state.

Actions are declared in html with the following syntax:

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

Super chunk can fetch esmodules using the following syntax:

```html
<button
	pointerover:="esmodule"
	pointerover:url="/components/yet-another-button.js"
></button>
```

Then listen for request state with `#esmodule` events in javascript-land.

```ts
document.addEventListener("#esmodule", function (e: ActionEvent) {
	let { status, url } = e.actionParams;
});
```

## JSON

Super chunk can fetch and dispatch JSON using the following syntax:

```html
<button
	pointerdown:="json"
	pointerdown:url="/fetch/some.json"
	pointerdown:throttle
	pointerdown:throttle-ms=""
	pointerdown:queued=""
></button>
```

## HTML

Super chunk can fetch html using the following syntax:

```html
<button
	click:="html"
	click:url="/fetch/some.html"
></button>
```

## License

`HyperAction-js` is released under the BSD 3-Clause License.
