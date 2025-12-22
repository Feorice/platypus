/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <explanation> */
import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { CronTime } from 'cron';
import type { UpdateResult } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { TimerEntity } from '../db/entities/timer.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { TasksService } from '../services/tasks.service';
// biome-ignore lint/style/useImportType: <explanation>
import { TimerResponse, TimerService } from '../services/timer.service';

class FindAllDto {
	@IsBoolean()
	@IsOptional()
	@Transform(({ value }) => value === 'true')
	hidden: boolean;
}

@Controller('timer')
export class TimerController {
	constructor(
		private timerService: TimerService,
		private taskService: TasksService,
		// private hardwareService: HardwareService,
	) {}

	@Get()
	@UsePipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
		}),
	)
	index(@Query() params: FindAllDto): Promise<TimerResponse> {
		return this.timerService.findAll(params);
	}

	@Post(':id/enable')
	async enable(
		@Param('id') id: string,
		@Body() body: { enabled: boolean },
	): Promise<void> {
		const entityData: Partial<TimerEntity> = {
			id: Number(id),
			enabled: body.enabled,
		};
		await this.timerService.update(Number(id), entityData);
	}

	@Post(':id/updateTime')
	async update(
		@Param('id') id: number,
		@Body() entityData: TimerEntity,
	): Promise<UpdateResult> {
		const entityResponse = await this.timerService.findOne(Number(id));
		const entity = entityResponse.timers[0];

		const startTimer = this.taskService.getJob(
			`${entity.name}:${entity.relayName}:START`,
		);
		const endTimer = this.taskService.getJob(
			`${entity.name}:${entity.relayName}:END`,
		);
		const startTime = new Date(entityData.startTime);
		const endTime = new Date(entityData.endTime);
		const cronStartTime = `${startTime.getMinutes()} ${startTime.getHours()} * * *`;
		const cronEndTime = `${endTime.getMinutes()} ${endTime.getHours()} * * *`;

		if (startTimer) {
			startTimer.setTime(new CronTime(cronStartTime));
		}

		if (endTimer) {
			endTimer.setTime(new CronTime(cronEndTime));
		}

		return this.timerService.update(Number(id), entityData);
	}

	// Probably don't need this anymore since we create these on startup now.
	// @Post('create')
	// async create(@Body() entityData: TimerEntity): Promise<TimerResponse> {
	//   const data = {
	//     ...entityData,
	//     relay: `${entityData.relay}:${entityData.name}`,
	//   };
	//
	//   if (entityData.enabled) {
	//     const startTime = new Date(data.startTime);
	//     const endTime = new Date(data.endTime);
	//     const cronStartTime = `${startTime.getMinutes()} ${startTime.getHours()} * * *`;
	//     const cronEndTime = `${endTime.getMinutes()} ${endTime.getHours()} * * *`;
	//
	//     console.log('cronStartTime', cronStartTime);
	//     this.taskService.addJob(
	//       `${data.relay}:START`,
	//       new CronJob(cronStartTime, () => {
	//         console.log('running start timer');
	//         this.hardwareService.setRelay(0);
	//       }),
	//     );
	//
	//     console.log('cronEndTime', cronEndTime);
	//     this.taskService.addJob(
	//       `${data.relay}:END`,
	//       new CronJob(cronEndTime, () => {
	//         console.log('running end timer');
	//         this.hardwareService.setRelay(1);
	//       }),
	//     );
	//
	//     this.taskService.startJob(`${data.relay}:START`);
	//     this.taskService.startJob(`${data.relay}:END`);
	//   }
	//
	//   return this.timerService.create(data);
	// }

	// @Delete(':id/delete')
	// async delete(@Param('id') id: number): Promise<DeleteResult> {
	// 	return this.timerService.delete(id);
	// }
}
