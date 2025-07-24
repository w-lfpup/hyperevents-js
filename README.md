# Shebang-js

A hypertext extension for the browser.

## About

`Superchunk` enables a browser to declaratively:

- fetch esmodules
- query JSON APIs
- fetch html fragments
- dispatch actions
- throttle requests
- queue requests

## Install

```html
npm install https://github.com/wolfpup-software/superfetch-js
```

## Actions

Superchunk dispatches action events using the following syntax:

```html
<button
	click:="update_something"
></button>
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
	pointerdown:json="/fetch/some.json"
	pointerdown:throttle="document"
	pointerdown:throttle-ms="100"
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
