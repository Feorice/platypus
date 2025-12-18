import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

export enum RelayName {
	RELAY_ONE = 'RELAY_ONE',
	RELAY_TWO = 'RELAY_TWO',
	RELAY_THREE = 'RELAY_THREE',
	RELAY_FOUR = 'RELAY_FOUR',
}

@Entity()
export class TimerEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	name: string;

	// TODO: We'll use this at some point  after we actually get the hardware shit taken care of.
	@Column({ unique: true, type: 'simple-enum', enum: RelayName })
	relayName: RelayName;

	@Column({ nullable: true })
	relayPin: number;

	@Column({ default: false })
	enabled: boolean;

	@Column({ default: false })
	isOn: boolean;

	@CreateDateColumn({ default: '1969-01-01T00:00:00.000Z' })
	startTime: Date;

	@CreateDateColumn({ default: '1969-01-01T00:00:00.000Z' })
	endTime: Date;
}
