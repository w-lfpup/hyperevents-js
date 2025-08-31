# EsModule Events

Import javascript modules and moniter the status of their request.

```html
<div
	pointerover:="_esmodule"
	pointerover:url="/components/yet-another-button.js"
></div>
```

Then listen for request state with `#esmodule` events in javascript-land.

```ts
document.addEventListener("#esmodule", function (e: EsModuleEvent) {
	let { status, url } = e.requestState;
});
```

## Lifecycle

An EsModule event has the following lifecycle:

- requested
- rejected
- resolved
