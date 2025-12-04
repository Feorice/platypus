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
import { EntitiesService } from './entities.service';
// biome-ignore lint/style/useImportType: <explanation>
import { GenericEntity } from './entity.entity';

@Controller('entities')
export class EntitiesController {
	constructor(private entitiesService: EntitiesService) {}

	@Get()
	index(): Promise<GenericEntity[]> {
		return this.entitiesService.findAll();
	}

	@Post('create')
  async create(@Body() entitytData: GenericEntity): Promise<any> {
    return this.entitiesService.create(entitytData);
  }

	@Put(':id/update')
	async update(
		@Param('id') id,
		@Body() entityData: GenericEntity,
	): Promise<any> {
		entityData.id = Number(id);
		return this.entitiesService.update(entityData);
	}

	@Delete(':id/delete')
  async delete(@Param('id') id): Promise<any> {
    return this.entitiesService.delete(id);
  }
}
