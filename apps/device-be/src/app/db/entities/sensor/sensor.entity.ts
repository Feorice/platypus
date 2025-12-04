import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SensorEntity {
	constructor(
		id: number,
		scale: 'C' | 'F',
		temperature: number,
		humidity: number,
	) {
		this.id = id;
		this.scale = scale;
		this.temperature = temperature;
		this.humidity = humidity;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	scale: 'C' | 'F';

	@Column()
	temperature: number;

	@Column()
	humidity: number;
}
