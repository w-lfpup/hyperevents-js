# Shebang-js

A hypertext extension for the browser.

## About

`Superchunk` enables a browser to declaratively:

- fetch html fragments
- fetch esmodules
- query JSON APIs
- dispatch actions
- move elements around DOM elements
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
	click:="action"
	click:action="update_something"
></button>
```

## JSON

Super chunk can fetch and dispatch JSON using the following syntax:

```html
<button
	click:="json"
	click:json="/api/fetch_some.json"
></button>
```

## HTML

Super chunk can fetch html using the following syntax:

```html
<button
	click:="html"
	click:url="/api/fetch_some.html"
></button>
```

## ES Modules

Super chunk can fetch esmodules using the following syntax:

```html
<button
	click:="esmodule"
	click:url="/components/button.js"
></button>
```

## License

`Superchunk-js` is released under the BSD 3-Clause License.
