/** biome-ignore-all lint/style/useImportType: <explanation> */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { SensorEntity } from '../db/entities/sensor.entity';

export type TemperatureScale = 'C' | 'F';

export interface SensorDataResponse {
	scale: TemperatureScale;
	temperature: number;
	humidity: number;
}

@Injectable()
export class SensorService {
	constructor(
		@InjectRepository(SensorEntity)
		private entityRepository: Repository<SensorEntity>,
	) {}

	async findAll(): Promise<SensorEntity[]> {
		return await this.entityRepository.find();
	}

	async create(entity: Partial<SensorEntity>): Promise<SensorEntity> {
		return await this.entityRepository.save(entity);
	}

	async update(entity: SensorEntity): Promise<UpdateResult> {
		return await this.entityRepository.update(entity.id, entity);
	}

	async delete(id: number): Promise<DeleteResult> {
		return await this.entityRepository.delete(id);
	}
}
