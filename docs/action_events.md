# Action Events

The following example shows how to declare an `#action` in html.

```html
<button click:="update_something"></button>
```

There is an alternative and more explicit syntax available:

```html
<button click:="_action" click:action="update_something"></button>
```

Then listen for `#action` events in javascript-land.

```ts
document.addEventListener("#action", function (e: ActionEvent) {
	let { action, sourceEvent } = e.actionParams;

	if ("update_something" === action) {
		// update the thing!
	}
});
```

## Lifecycle

There is no lifecycle, simply an `#action` event

An action event is a synchronous and immediately dispatched event.

It is the most atomic kind of `Hyperevent`. It's meant to be a direct path from UI to local state.
