import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { GenericEntity } from '../db/entities/generic-entity.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { GenericEntityService } from '../services/generic-entity.service';

@Controller('generic-entity')
export class GenericEntityController {
	constructor(private entitiesService: GenericEntityService) {}

	@Get()
	index(): Promise<GenericEntity[]> {
		return this.entitiesService.findAll();
	}

	@Post('create')
	async create(@Body() entityData: GenericEntity): Promise<any> {
		return this.entitiesService.create(entityData);
	}

	@Put(':id/update')
	async update(
		@Param('id') id: number,
		@Body() entityData: GenericEntity,
	): Promise<any> {
		entityData.id = Number(id);
		return this.entitiesService.update(entityData);
	}

	@Delete(':id/delete')
	async delete(@Param('id') id: number): Promise<any> {
		return this.entitiesService.delete(id);
	}
}
