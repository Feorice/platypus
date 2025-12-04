import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SensorEntity {
	@PrimaryGeneratedColumn('uuid')
	id: number;

	@Column({ type: 'varchar', length: 1 })
	scale: 'C' | 'F';

	@Column({ type: 'int' })
	temperature: number;

	@Column({ type: 'int' })
	humidity: number;
}
