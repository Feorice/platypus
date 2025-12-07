/** biome-ignore-all lint/style/useImportType: <explanation> */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
	DeleteResult,
	QueryFailedError,
	Repository,
	UpdateResult,
} from 'typeorm';

import { TimerEntity } from '../db/entities/timer.entity';

export interface TimerResponse {
	timers: TimerEntity[];
	error?: string;
	ok: boolean;
}

@Injectable()
export class TimerService {
	constructor(
		@InjectRepository(TimerEntity)
		private timerRepository: Repository<TimerEntity>,
	) {}

	async findAll(): Promise<TimerResponse> {
		const timers = await this.timerRepository.find();
		return {
			timers: timers,
			ok: true,
		};
	}

	async findOne(id: number): Promise<TimerResponse> {
		try {
			const timer = await this.timerRepository.findOne({ where: { id } });

			if (timer) {
				return {
					timers: [timer],
					ok: true,
				};
			}

			return {
				timers: [],
				ok: true,
			};
		} catch (error) {
			console.log(error);

			return {
				timers: [],
				ok: false,
			};
		}
	}

	async create(entity: TimerEntity): Promise<TimerResponse> {
		try {
			const count = await this.timerRepository.count();
			if (count >= 4) {
				return {
					timers: [],
					error: 'Cannot create more than 4 timers.',
					ok: false,
				};
			}
			const createdEntity = await this.timerRepository.save(entity);
			return {
				timers: [createdEntity],
				ok: true,
			};
		} catch (error) {
			return {
				timers: [],
				error: (error as QueryFailedError).message,
				ok: false,
			};
		}
	}

	async update(entity: TimerEntity): Promise<UpdateResult> {
		return await this.timerRepository.update(entity.id, entity);
	}

	async delete(id: number): Promise<DeleteResult> {
		return await this.timerRepository.delete(id);
	}
}
