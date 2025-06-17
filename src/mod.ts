export interface SuperFetchParamsInterface {
	host: ParentNode;
	eventNames: string[];
	connected?: boolean;
}

export interface SuperFetchInterface {
	connect(): void;
	disconnect(): void;
}

export class SuperFetch {
	#params: SuperFetchParamsInterface;

	constructor(params: SuperFetchParamsInterface) {
		this.#params = params;
		if (this.#params.connected) this.connect();
	}

	connect() {
		let { host, eventNames } = this.#params;
		
		// for (let name of eventNames) {
		// 	host.addEventListener(name, dispatchSuperFetch);
		// }

		// addEventListener #fetch
		// addEventListener #response
		// addEventListener #projection
	}

	disconnect() {
		let { host, eventNames } = this.#params;
		
		// for (let name of eventNames) {
		// 	host.removeEventListener(name, dispatchSuperFetch);
		// }

		// removeEventListener #fetch
		// removeEventListener #response
		// removeEventListener #projection
	}
}
