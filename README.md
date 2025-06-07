# Superfetch-js

A hypertext extension for the browser to declaratively fetch HTML.

## Install

```html
npm install https://github.com/wolfpup-software/superfetch-js
```

## Events

Superfetch uses `events` to signal the state of a fetch.
- a `#request` event asks to fetch some HTML
- the `#response` event dispatches when request is complete
- the `#projection` event fires when a response is projected onto the DOM.

## License

`Hx-js` is released under the BSD 3-Clause License.
