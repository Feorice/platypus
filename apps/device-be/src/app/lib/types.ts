export type RelayName =
	| 'RELAY_ONE'
	| 'RELAY_TWO'
	| 'RELAY_THREE'
	| 'RELAY_FOUR';
export type RelayState = 'ON' | 'OFF';
export interface Relay {
	name: RelayName;
	state: RelayState;
}
export interface Timer {
	id: number;
	enabled: boolean;
	isOn: boolean;
	startTime: Date;
	endTime: Date;
	relay: string;
}
