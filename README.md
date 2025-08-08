# Shebang-js

A hypertext extension for the browser.

## About

Superchunk is a alternative to bulky frontend frameworks and enables a browser to declaratively:

- query JSON APIs
- fetch html fragments
- lazy-load esmodules
- dispatch action events (think redux actions)

## Install

```html
npm install https://github.com/wolfpup-software/superfetch-js
```

## Setup

Add a `host` and some `eventNames` on instantiation.

```ts
let bang = new Superfetch({
	host: document,
	connected: true,
	eventNames: ["click", "pointerover"],
});
```

## Actions

Dispatches action events using the following syntax:

```html
<button click:="update_something"></button>
```

## ES Modules

Super chunk can fetch esmodules using the following syntax:

```html
<button
	pointerover:="esmodule"
	pointerover:url="/components/yet-another-button.js"
></button>
```

## JSON

Super chunk can fetch and dispatch JSON using the following syntax:

```html
<button
	pointerdown:="json"
	pointerdown:url="/fetch/some.json"
></button>
```

## HTML

Super chunk can fetch html using the following syntax:

```html
<button
	click:="html"
	click:url="/fetch/some.html"
	click:projection="replace"
	click:match="_parent"
	click:querySelector="ul"
	click:querySelectorAll="[profile=fri490r]"
></button>
```

## License

`Superchunk-js` is released under the BSD 3-Clause License.
