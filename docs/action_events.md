# Action Events

Create actions from HTML.

```html
<button click:="update_something"></button>
```

Then listen for `#action` events in javascript-land.

```ts
document.addEventListener("#action", function (e: ActionEvent) {
	let { action, sourceEvent } = e.actionParams;
});
```

## Lifecycle

An action event is a synchronous and immediately dispatched event.

There is no lifecycle, simply an `#action` event
