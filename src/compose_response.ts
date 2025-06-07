import { HxResponseEvent, HxResponseErrorEvent } from "./hx_response_event.js";

function getProjectionStyle(el: Element) {
	return el.getAttribute("_projection");
}

function getProjectionTarget(e: Event): EventTarget | undefined {
	let { target } = e;
	if (!(target instanceof Element)) return null;

	const selector = target.getAttribute("_target") || "_currentTarget";
	if ("_document" === selector) return document;
	if ("_target" === selector) return target;

	let { currentTarget } = e;
	if ("_currentTarget" === selector) return currentTarget;

	if (
		currentTarget instanceof Document ||
		currentTarget instanceof DocumentFragment ||
		currentTarget instanceof Element
	) {
		return currentTarget.querySelector(selector);
	}
}

function getThrottleTarget(
	e: Event,
	projectionTarget: EventTarget,
): EventTarget {
	let { target, currentTarget } = e;
	if (!(target instanceof Element)) return null;

	const selector = target.getAttribute("_throttle") || "none";
	if ("_projectionTarget" === selector) return projectionTarget;
	if ("_document" === selector) return document;
	if ("_target" === selector) return target;
	if ("_currentTarget" === selector) return currentTarget;
}

function getTimeoutMs(el: Element) {
	let timeoutMsAttr = el.getAttribute("_timeout-ms");
	let timeoutMs = parseFloat(timeoutMsAttr);
	if (Number.isNaN(timeoutMs)) {
		timeoutMs = 5000;
	}

	return timeoutMs;
}

function buildHxRequest(e: Event): Request | undefined {
	let { target } = e;

	if (target instanceof HTMLAnchorElement) {
		const href = target.getAttribute("_href");
		if (href) return new Request(href);
	}

	if (target instanceof HTMLFormElement) {
		// get _action
		const action = target.getAttribute("_href");
		if (action)
			return new Request(action, {
				method: target.getAttribute("_method") || "get",
				body: new FormData(target),
			});
	}
}

function getAbortController(target: Element): [AbortController, AbortSignal] {
	let timeoutMs = getTimeoutMs(target);
	let abortController = new AbortController();
	let timeoutAbortSignal = AbortSignal.timeout(timeoutMs);
	let signal = AbortSignal.any([abortController.signal, timeoutAbortSignal]);

	return [abortController, signal];
}

function setThrottler(
	throttler: WeakMap<EventTarget, AbortController>,
	throttleTarget: EventTarget | null,
	abortController: AbortController,
) {
	let el = throttler.get(throttleTarget);
	if (el) el.abort();

	if (throttleTarget) throttler.set(throttleTarget, abortController);
}

function dangerouslyBuildTemplate(
	response: Response,
	text: string,
): HTMLTemplateElement {
	let contentType = response.headers.get("content-type");

	if ("text/html; charset=utf-8" !== contentType) {
		throw new Error(`unexpected content-type: ${contentType}`);
	}

	const templateEl = document.createElement("template");
	templateEl.innerHTML = text;

	return templateEl;
}

function fetchAndDispatchResponseEvent(
	target: EventTarget,
	request: Request,
	signal: AbortSignal,
	projectionStyle: string,
	projectionTarget: EventTarget,
) {
	let hangarElement: Element;
	let targetElement: Element;
	if (projectionTarget instanceof Element && target instanceof Element) {
		hangarElement = projectionTarget;
		targetElement = target;
	}

	fetch(request, {
		signal,
	})
		.then(function (response) {
			if (hangarElement) hangarElement.setAttribute("_fetch-state", "pending");
			if (targetElement)
				targetElement.setAttribute("_projection-state", "pending");

			return Promise.all([response, response.text()]);
		})
		.then(function ([response, body]) {
			if (hangarElement)
				hangarElement.setAttribute("_fetch-state", "fulfilled");
			if (targetElement)
				targetElement.setAttribute("_projection-state", "fulfilled");

			let template = dangerouslyBuildTemplate(response, body);

			let event = new HxResponseEvent({
				template,
				response,
				projectionTarget,
				projectionStyle,
				eventInit: { bubbles: true, composed: true },
			});

			target.dispatchEvent(event);
		})
		.catch(function (reason: any) {
			if (hangarElement) hangarElement.setAttribute("_fetch-state", "rejected");
			if (targetElement)
				targetElement.setAttribute("_projection-state", "rejected");

			let event = new HxResponseErrorEvent(reason, {
				bubbles: true,
				composed: true,
			});
			target.dispatchEvent(event);
		});
}

function composeResponse(
	throttler: WeakMap<EventTarget, AbortController>,
	e: Event,
) {
	if (e.defaultPrevented) return;
	
	let { target } = e;
	if (!(target instanceof Element)) return;

	let projectionStyle = getProjectionStyle(target);
	if (!projectionStyle) return;

	let request = buildHxRequest(e);
	if (!request) return;

	let [abortController, signal] = getAbortController(target);
	let projectionTarget = getProjectionTarget(e);
	let throttleTarget = getThrottleTarget(e, projectionTarget);

	setThrottler(throttler, throttleTarget, abortController);

	fetchAndDispatchResponseEvent(
		target,
		request,
		signal,
		projectionStyle,
		projectionTarget,
	);
}

export { composeResponse };
