/** biome-ignore-all lint/style/useImportType: <explanation> */
import { Injectable, Logger } from '@nestjs/common';
import type { Relay, RelayName, RelayState } from '../lib/types';
import { SensorDataResponse } from './sensor.service';

@Injectable()
export class HardwareService {
	async getSensorData() {
		// const sensorEntity = await this.sensorService.create(data);
		// Logger.debug('sensorEntity', sensorEntity);
		return this.getAtmosphereData();
	}

	getRelayDefaultConfig() {
		const config: Relay[] = [
			{ name: 'RELAY_ONE', state: 'OFF' },
			{ name: 'RELAY_TWO', state: 'OFF' },
			{ name: 'RELAY_THREE', state: 'OFF' },
			{ name: 'RELAY_FOUR', state: 'OFF' },
		];
		return config;
	}

	setRelayState(relayName: RelayName, state: RelayState) {
		Logger.debug('setRelayState', { relayName, state });
	}

	private getRandomNumber = (min: number, max: number) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	private getAtmosphereData(): SensorDataResponse {
		const temperature = this.getRandomNumber(70, 75);
		const humidity = this.getRandomNumber(35, 40);

		return {
			scale: 'C',
			temperature,
			humidity,
		};
	}
}
