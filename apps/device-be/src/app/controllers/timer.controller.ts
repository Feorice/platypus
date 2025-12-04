import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import type { DeleteResult, UpdateResult } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { TimerEntity } from '../db/entities/timer.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { TimerResponse, TimerService } from '../services/timer.service';

@Controller('timer')
export class TimerController {
	constructor(private timerService: TimerService) {}

	@Get()
	index(): Promise<TimerResponse> {
		return this.timerService.findAll();
	}

	@Post('create')
	async create(@Body() entityData: TimerEntity): Promise<TimerResponse> {
		return this.timerService.create(entityData);
	}

	@Put(':id/update')
	async update(
		@Param('id') id: number,
		@Body() entityData: TimerEntity,
	): Promise<UpdateResult> {
		entityData.id = Number(id);
		return this.timerService.update(entityData);
	}

	@Delete(':id/delete')
	async delete(@Param('id') id: number): Promise<DeleteResult> {
		return this.timerService.delete(id);
	}
}
