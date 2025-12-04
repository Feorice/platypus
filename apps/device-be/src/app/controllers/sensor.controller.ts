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
import { SensorEntity } from '../db/entities/sensor.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { SensorService } from '../services/sensor.service';

@Controller('entities')
export class SensorController {
	constructor(private entitiesService: SensorService) {}

	@Get()
	index(): Promise<SensorEntity[]> {
		return this.entitiesService.findAll();
	}

	@Post('create')
	async create(@Body() entityData: SensorEntity): Promise<any> {
		return this.entitiesService.create(entityData);
	}

	@Put(':id/update')
	async update(
		@Param('id') id: number,
		@Body() entityData: SensorEntity,
	): Promise<any> {
		entityData.id = Number(id);
		return this.entitiesService.update(entityData);
	}

	@Delete(':id/delete')
	async delete(@Param('id') id: number): Promise<any> {
		return this.entitiesService.delete(id);
	}
}
