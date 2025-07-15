# Superchunk-js

A hypertext extension for the browser.

## About

`Superchunk` enables a browser to declaratively:
- fetch html fragments
- fetch esmodules
- query JSON APIs 
- dispatch actions
- update DOM elements
- throttle requests
- queue requests



## Install

```html
npm install https://github.com/wolfpup-software/superfetch-js
```

## Events

Superfetch uses `events` to signal the state of a fetch.

- a `#request` event asks to fetch some HTML
- the `#response` event dispatches when request is complete
- the `#projection` event fires when a response is projected onto the DOM.
- `#json` `#esmodule` `#html` and `#action` events

## License

`Hx-js` is released under the BSD 3-Clause License.


```html

<a
	click:
	click:="./story-likes/f4f4rfr/f345t9/"
	click:method="POST"
></a>

<div>
	<p>
		Submit events are different. Theyre always associated with a form.

		So even if there were __submit actions in parent elements
		theyre still dealing with the same information

		Could be good for logging and debugging but I can't imagine much else
	</p>

	<form
		enctype="multipart/form-data"
		
		submit:="./bear/story-likes/f3r49r.html"
		submit:method="POST | PATCH | UPDATE"
		submit:prevent-default
	
		submit:="./bear/story-likes/f3r49r.html"
		submit:method="POST | PATCH | UPDATE"
		submit:projection="replace"
		submit:query_selector="_target"
		submit:prevent-default
	>
	</form>
</div>

<!-- _target | _currentTarget | _document | _projectionTarget | https | /bear.index -->
<!-- #html #json #esmodule #action -->
<button
	click:="html | json | action | esmodule | ancestor | _target | _currentTarget | querySelector | querySelectorAll | action"

	click:="json"
	click:action="update_animals"
	click:url="./animals.json"

	click:="action"
	click:action="increment_counter"

	click:="ancestor"
	click:selector="li"
	click:query-selector="section[hello]"
	click:projection="swap"

	click:="querySelector"
	click:selector="ul"

	click:="html"
	click:url="./bear"
	click:method="GET | DELETE | POST | PATCH"

	focusin:="esmodule"
	focusin:url="./bear"
	focusin:throttle="_document"

	click:target-selector="section[attr]"
	

	click:="querySelector"
	click:selector="li"
	click:query-selector-all="section[profile]"
	
	click:throttle="_currentTarget"
	click:queue="_projectionTarget"
	click:prevent-default
	click:stop-propagation
>
	UwU
</button>
```
