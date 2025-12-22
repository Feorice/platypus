export interface ITimer {
	id: string;
	name?: string;
	enabled?: boolean;
	isOn?: boolean;
	hidden?: boolean;
	startTime: string;
	endTime: string;
}
