# HTML Events

Fetch HTML and moniter the status of the request.

```html
<input
	input:="_html"
	input:action="get_entries"
	input:url="/fetch/some.html"
>
```

Then listen for request state with `#html` events in javascript-land.

```ts
document.addEventListener("#html", function (e: HtmlEvent) {
	let { requestState } = e;
	let { status } = requestState;

	if ("resolved" === status) {
		let { html } = requestState;
	}
});
```

## Lifecycle

An HTML event has the following lifecycle:

- queued (optional)
- requested
- rejected
- resolved
