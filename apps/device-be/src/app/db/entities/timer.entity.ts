import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

enum RelayName {
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
	// @Column({ unique: true, type: 'simple-enum', enum: RelayName })
	// relay: RelayName;

	@Column({ nullable: true })
	relay: string;

	@Column()
	enabled: boolean;

	@Column()
	isOn: boolean;

	@CreateDateColumn()
	startTime: Date;

	@CreateDateColumn()
	endTime: Date;
}
