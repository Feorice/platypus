import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { CronJob, CronTime } from 'cron';
import type { DeleteResult, UpdateResult } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { TimerEntity } from '../db/entities/timer.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { TasksService } from '../services/tasks.service';
// biome-ignore lint/style/useImportType: <explanation>
import { TimerResponse, TimerService } from '../services/timer.service';
import { HardwareService } from '../services/hardware.service';

@Controller('timer')
export class TimerController {
	constructor(
		private timerService: TimerService,
		private taskService: TasksService,
		private hardwareService: HardwareService,
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
			const cronStartTime = `${startTime.getMinutes()} ${startTime.getHours()} * * *`;
			const cronEndTime = `${endTime.getMinutes()} ${endTime.getHours()} * * *`;

			console.log('cronStartTime', cronStartTime);
			this.taskService.addJob(
				`${data.relay}:START`,
				new CronJob(cronStartTime, () => {
					console.log('running start timer');
					this.hardwareService.setRelay(0);
				}),
			);

			console.log('cronEndTime', cronEndTime);
			this.taskService.addJob(
				`${data.relay}:END`,
				new CronJob(cronEndTime, () => {
					console.log('running end timer');
					this.hardwareService.setRelay(1);
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

		const entityResponse = await this.timerService.findOne(entityData.id);
		const entity = entityResponse.timers[0];

		const startTimer = this.taskService.getJob(`${entity.relay}:START`);
		const endTimer = this.taskService.getJob(`${entity.relay}:END`);
		console.log('update timers', entity);
		const startTime = new Date(entityData.startTime);
		const endTime = new Date(entityData.endTime);
		const cronStartTime = `${startTime.getMinutes()} ${startTime.getHours()} * * *`;
		const cronEndTime = `${endTime.getMinutes()} ${endTime.getHours()} * * *`;

		console.log('startCron', startTimer || 'shits undefined');
		console.log('endCron', endTimer || 'shits undefined');
		if (startTimer) {
			startTimer.setTime(new CronTime(cronStartTime));
		}

		if (endTimer) {
			endTimer.setTime(new CronTime(cronEndTime));
		}

		return this.timerService.update(entityData);
	}

	@Delete(':id/delete')
	async delete(@Param('id') id: number): Promise<DeleteResult> {
		return this.timerService.delete(id);
	}
}
