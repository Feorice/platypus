import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GenericEntity {
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
