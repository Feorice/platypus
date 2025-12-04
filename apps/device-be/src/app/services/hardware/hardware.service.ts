/** biome-ignore-all lint/style/useImportType: <explanation> */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorEntity } from '../../db/entities/sensor/sensor.entity';

type TemperatureScale = 'C' | 'F';

interface SensorDataResponse {
	scale: TemperatureScale;
	temperature: number;
	humidity: number;
}

@Injectable()
export class HardwareService {
	constructor(
		@InjectRepository(SensorEntity)
		private sensorRepository: Repository<SensorEntity>,
	) {}

	private getRandomNumber = (min: number, max: number) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	getAtmosphereData(): SensorDataResponse {
		const temperature = this.getRandomNumber(70, 75);
		const humidity = this.getRandomNumber(35, 40);

		return {
			scale: 'C',
			temperature,
			humidity,
		};
	}

	getTimers() {}

	getTimer() {}

	createTimer() {}

	deleteTimer() {}
}
