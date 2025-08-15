# HyperEvents-js

A hypertext extension for the browser.

## About

Superchunk is a alternative to bulky frontend frameworks

A handful of kbs enables a browser to declaratively:

- query JSON APIs
- fetch html fragments
- lazy-load esmodules
- dispatch action events (think redux actions)
- throttle any action (except esmodules)
- queue any action (except esmodules)

And with those core features, Superchunk skips over all the imperative event bindings required in JSX or tagged templates.

## Install

```html
npm install https://github.com/wolfpup-software/superfetch-js
```

## Setup

Add a `target` and some `eventNames` on instantiation.

```ts
let bang = new Superfetch({
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
	pointerdoin:queued=""
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

`Superchunk-js` is released under the BSD 3-Clause License.
