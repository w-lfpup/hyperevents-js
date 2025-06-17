"use strict";
// import { HxResponseEvent } from "../src/hx-response/mod.js";
// interface HxProjectEventImpl {
// 	projectionTarget: EventTarget;
// 	projectedFragment: Node;
// 	projectionStyle: string;
// 	disconnectedFragment?: Node;
// }
// interface HxProjectEventParams {
// 	projectionTarget: EventTarget;
// 	projectionStyle: string;
// 	projectedFragment: Node;
// 	disconnectedFragment?: Node;
// }
// class HxProjectEvent extends Event implements HxProjectEventImpl {
// 	#params: HxProjectEventParams;
// 	constructor(params: HxProjectEventParams) {
// 		super("#projection", {
// 			bubbles: true,
// 			composed: true,
// 		});
// 		this.#params = params;
// 	}
// 	get projectionTarget() {
// 		return this.#params.projectionTarget;
// 	}
// 	get projectedFragment() {
// 		return this.#params.projectedFragment;
// 	}
// 	get disconnectedFragment() {
// 		return this.#params.disconnectedFragment;
// 	}
// 	get projectionStyle() {
// 		return this.#params.projectionStyle;
// 	}
// }
// type PlacementResults = [Node | undefined, Node | undefined];
// function projectPlacement(
// 	projectionTarget: EventTarget,
// 	template: HTMLTemplateElement,
// 	projectionStyle: string,
// ): PlacementResults {
// 	let fragment = template.content.cloneNode(true);
// 	let removedFragment: Node;
// 	if (
// 		projectionTarget instanceof Element ||
// 		projectionTarget instanceof Document ||
// 		projectionTarget instanceof DocumentFragment
// 	) {
// 		if ("start" === projectionStyle) {
// 			projectionTarget.insertBefore(fragment, projectionTarget.firstChild);
// 		}
// 		if ("end" === projectionStyle) {
// 			projectionTarget.appendChild(fragment);
// 		}
// 		if ("replace_children" === projectionStyle) {
// 			// get list of childNodes
// 			// add nodes to fragmentQ
// 			projectionTarget.replaceChildren(fragment);
// 		}
// 		if ("remove_children" === projectionStyle) {
// 			// get list of childNodes
// 			// add nodes to fragmentQ
// 			projectionTarget.replaceChildren();
// 		}
// 		const { parentElement } = projectionTarget;
// 		if (parentElement) {
// 			if ("replace" === projectionStyle) {
// 				removedFragment = parentElement.replaceChild(
// 					fragment,
// 					projectionTarget,
// 				);
// 			}
// 			if ("remove" === projectionStyle) {
// 				removedFragment = parentElement.removeChild(projectionTarget);
// 			}
// 			if ("before" === projectionStyle)
// 				parentElement.insertBefore(fragment, projectionTarget);
// 			if ("after" === projectionStyle)
// 				parentElement.insertBefore(fragment, projectionTarget.nextSibling);
// 		}
// 	}
// 	return [fragment, removedFragment];
// }
// function dispatchHxProjection(e: Event): void {
// 	if (e.defaultPrevented) return;
// 	if (!(e instanceof HxResponseEvent)) return;
// 	let { projectionStyle, projectionTarget, template } = e;
// 	let [projectedFragment, disconnectedFragment] = projectPlacement(
// 		projectionTarget,
// 		template,
// 		projectionStyle,
// 	);
// 	e.target.dispatchEvent(
// 		new HxProjectEvent({
// 			projectionTarget,
// 			projectedFragment,
// 			disconnectedFragment,
// 			projectionStyle,
// 		}),
// 	);
// }
// export type { HxProjectEventImpl };
// export { dispatchHxProjection, HxProjectEvent };
