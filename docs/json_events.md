# Json Events

Fetch JSON and moniter the status of the request.

```html
<span
	pointerdown:="_json"
	pointerdown:action="ping_api"
	pointerdown:url="/fetch/some.json"
></span>
```

Then listen for request state with `#json` events in javascript-land.

```ts
document.addEventListener("#json", function (e: JsonEvent) {
	let { requestState } = e;
	let { status } = requestState;

	if ("resolved" === status) {
		let { json } = requestState;
	}
});
```

## Lifecycle

An Json event has the following lifecycle:

- queued (optional)
- requested
- rejected
- resolved
