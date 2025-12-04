import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GenericEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	genericField: string;
}
