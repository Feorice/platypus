import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { CronJob } from 'cron';
import type { DeleteResult, UpdateResult } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { TimerEntity } from '../db/entities/timer.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { TasksService } from '../services/tasks.service';
// biome-ignore lint/style/useImportType: <explanation>
import { TimerResponse, TimerService } from '../services/timer.service';

@Controller('timer')
export class TimerController {
	constructor(
		private timerService: TimerService,
		private taskService: TasksService,
	) {}

	@Get()
	index(): Promise<TimerResponse> {
		return this.timerService.findAll();
	}

	@Post('create')
	async create(@Body() entityData: TimerEntity): Promise<TimerResponse> {
    const data = {
      ...entityData,
      relay: `${entityData.relay}:${entityData.name}`,
    };

		if (entityData.enabled) {

			const startTime = new Date(data.startTime);
			const endTime = new Date(data.endTime);
			this.taskService.addJob(
				`${data.relay}:START`,
				new CronJob(startTime, () => {
					console.log('running start timer');
				}),
			);

			this.taskService.addJob(
				`${data.relay}:END`,
				new CronJob(endTime, () => {
					console.log('running end timer');
				}),
			);

			this.taskService.startJob(`${data.relay}:START`);
			this.taskService.startJob(`${data.relay}:END`);
		}

		return this.timerService.create(data);
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
