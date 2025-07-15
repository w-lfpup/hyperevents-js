import { SuperChunk } from "superchunk";

const _superChunk = new SuperChunk({
	host: document,
	connected: true,
	eventNames: ["click"],
});
