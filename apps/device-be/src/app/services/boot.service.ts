import {
	Injectable,
	type OnApplicationBootstrap, Logger
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import type { ModeType } from 'rpi-io';
import type { Repository } from 'typeorm';
import { RelayName, TimerEntity } from '../db/entities/timer.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { HardwareService } from './hardware.service';
// biome-ignore lint/style/useImportType: <explanation>
import { TasksService } from './tasks.service';

interface RelayOption {
	name: 'RELAY_ONE' | 'RELAY_TWO' | 'RELAY_THREE' | 'RELAY_FOUR';
	pin: number;
	mode: ModeType;
	value: number;
}

@Injectable()
export class BootService implements OnApplicationBootstrap {
	constructor(
		@InjectRepository(TimerEntity)
		private timerRepository: Repository<TimerEntity>,
		private hardwareService: HardwareService,
		private configService: ConfigService,
		private taskService: TasksService,
	) {}

	async onApplicationBootstrap() {
		await this.initTimers();
	}

	async initTimers() {
		const instances = this.hardwareService.initializeRelays();

		if (instances) {
			const promises = [];

			const relayOptions: RelayOption[] | undefined =
				this.configService.get('relayOptions');

			if (relayOptions) {
				relayOptions.forEach((relayOption) => {
					const instance = instances.get(relayOption.pin);

					if (instance) {
						promises.push(
							this.timerRepository
								.createQueryBuilder()
								.insert()
								.into(TimerEntity)
								.values({
									name: relayOption.name,
									relayPin: relayOption.pin,
									relayName: RelayName[relayOption.name],
								})
								.execute()
								.catch(() => null),
						);
					}
				});

				await Promise.all(promises);
			}
		}

		const timers = await this.timerRepository.find();

		timers.forEach((timer) => {
			this.initRelayCron(timer);
		});
	}

	initRelayCron(timer: TimerEntity) {
		const startTime = new Date(timer.startTime);
		const endTime = new Date(timer.endTime);
		const cronStartTime = `${startTime.getMinutes()} ${startTime.getHours()} * * *`;
		const cronEndTime = `${endTime.getMinutes()} ${endTime.getHours()} * * *`;
		const cronStartName = `${timer.name}:${timer.relayName}:START`;
		const cronEndName = `${timer.name}:${timer.relayName}:END`;

		this.taskService.addJob(
			cronStartName,
			new CronJob(cronStartTime, () => {
				console.log('running start timer');
				this.hardwareService.setRelay(timer.relayPin, 0);
			}),
		);

		// console.log('cronEndTime', cronEndTime);
		this.taskService.addJob(
			cronEndName,
			new CronJob(cronEndTime, () => {
				console.log('running end timer');
				this.hardwareService.setRelay(timer.relayPin, 1);
			}),
		);

		if (timer.enabled) {
			const currentTime = new Date();
			const startingTimer = new Date();
			const endingTimer = new Date();

			startingTimer.setHours(startTime.getHours());
			startingTimer.setMinutes(startTime.getMinutes());
			endingTimer.setHours(endTime.getHours());
			endingTimer.setMinutes(endTime.getMinutes());

			if (
				currentTime.getTime() > startingTimer.getTime() &&
				currentTime.getTime() < endingTimer.getTime()
			) {
				Logger.debug('turning on relay')
				this.hardwareService.setRelay(timer.relayPin, 0);
			} else {
				Logger.debug('turning off relay')
				this.hardwareService.setRelay(timer.relayPin, 1);
			}

			this.taskService.startJob(cronStartName);
			this.taskService.startJob(cronEndName);
		}
	}
}
