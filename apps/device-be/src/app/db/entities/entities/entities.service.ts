/** biome-ignore-all lint/style/useImportType: <explanation> */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { GenericEntity } from './entity.entity';

@Injectable()
export class EntitiesService {
	constructor(
    @InjectRepository(GenericEntity)
    private entityRepository: Repository<GenericEntity>
  ) { }

	async findAll(): Promise<GenericEntity[]> {
		return await this.entityRepository.find();
	}

	async create(entity: GenericEntity): Promise<GenericEntity> {
		return await this.entityRepository.save(entity);
	}

	async update(entity: GenericEntity): Promise<UpdateResult> {
		return await this.entityRepository.update(entity.id, entity);
	}

	async delete(id): Promise<DeleteResult> {
		return await this.entityRepository.delete(id);
	}
}
