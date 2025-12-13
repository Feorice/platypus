import { Injectable, type OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { TimerEntity } from '../db/entities/timer.entity';

@Injectable()
export class BootService implements OnApplicationBootstrap {
	constructor(
		@InjectRepository(TimerEntity)
		private timerRepository: Repository<TimerEntity>
	) {}

	onApplicationBootstrap() {
		this.initTimers();
	}

	async initTimers() {
		const timers = await this.timerRepository.find();
		console.log({ timers });
	}
}
