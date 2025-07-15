import { dispatch } from "./dispatch_superchunk.js"; 

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

		// addEventListener #fetch
		// addEventListener #response
		// addEventListener #projection
	}

	disconnect() {
		let { host, eventNames } = this.#params;
		
		for (let name of eventNames) {
			host.removeEventListener(name, dispatch);
		}

		// removeEventListener #fetch
		// removeEventListener #response
		// removeEventListener #projection
	}
}
