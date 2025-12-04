/** biome-ignore-all lint/style/useImportType: <explanation> */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { TimerEntity } from '../db/entities/timer.entity';

@Injectable()
export class TimerService {
	constructor(
		@InjectRepository(TimerEntity)
		private entityRepository: Repository<TimerEntity>,
	) {}

	async findAll(): Promise<TimerEntity[]> {
		return await this.entityRepository.find();
	}

	async create(entity: TimerEntity): Promise<TimerEntity> {
		return await this.entityRepository.save(entity);
	}

	async update(entity: TimerEntity): Promise<UpdateResult> {
		return await this.entityRepository.update(entity.id, entity);
	}

	async delete(id: number): Promise<DeleteResult> {
		return await this.entityRepository.delete(id);
	}
}
