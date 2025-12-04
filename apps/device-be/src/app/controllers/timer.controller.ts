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
import { TimerEntity } from '../db/entities/timer.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { TimerService } from '../services/timer.service';

@Controller('entities')
export class TimerController {
	constructor(private entitiesService: TimerService) {}

	@Get()
	index(): Promise<TimerEntity[]> {
		return this.entitiesService.findAll();
	}

	@Post('create')
	async create(@Body() entityData: TimerEntity): Promise<any> {
		return this.entitiesService.create(entityData);
	}

	@Put(':id/update')
	async update(
		@Param('id') id: number,
		@Body() entityData: TimerEntity,
	): Promise<any> {
		entityData.id = Number(id);
		return this.entitiesService.update(entityData);
	}

	@Delete(':id/delete')
	async delete(@Param('id') id: number): Promise<any> {
		return this.entitiesService.delete(id);
	}
}
