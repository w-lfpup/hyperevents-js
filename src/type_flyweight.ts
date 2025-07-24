export interface DispatchParams {
	sourceEvent: Event;
	el: Element;
	currentTarget: Event["currentTarget"];
	type: string;
}
