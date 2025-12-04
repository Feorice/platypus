import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import type { RelayName, RelayState } from '../../lib/types';

@Entity()
export class RelayEntity {
	@PrimaryGeneratedColumn('uuid')
	id: number;

	@Column({ type: 'varchar' })
	name: RelayName;

	@Column({ type: 'varchar' })
	state: RelayState;
}
