import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TimerEntity {
	constructor(
		id: number,
		relay: string,
		enabled: boolean,
		isOn: boolean,
		startTime: Date,
		endTime: Date,
	) {
		this.id = id;
		this.relay = relay;
		this.enabled = enabled;
		this.isOn = isOn;
		this.startTime = startTime;
		this.endTime = endTime;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	relay: string;

	@Column()
	enabled: boolean;

	@Column()
	isOn: boolean;

	@Column()
	startTime: Date;

	@Column()
	endTime: Date;
}
