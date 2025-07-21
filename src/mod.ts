import { dispatch } from "./dispatch.js";

export { ActionEvent } from "./action_event.js";
export { JsonEvent } from "./json_event.js";

/*
	Queue, throttle actions that require remote interactions

	Esmodule is unique 

	throttle is _doc _target _currentTarget selector _url
*/

export interface SuperChunkParamsInterface {
	host: ParentNode;
	eventNames: string[];
	connected?: boolean;
}

export interface SuperChunkInterface {
	connect(): void;
	disconnect(): void;
}

export class SuperChunk {
	#params: SuperChunkParamsInterface;

	constructor(params: SuperChunkParamsInterface) {
		this.#params = params;
		if (this.#params.connected) this.connect();
	}

	connect() {
		let { host, eventNames } = this.#params;

		for (let name of eventNames) {
			host.addEventListener(name, dispatch);
		}
	}

	disconnect() {
		let { host, eventNames } = this.#params;

		for (let name of eventNames) {
			host.removeEventListener(name, dispatch);
		}
	}
}
