/** biome-ignore-all lint/style/useImportType: <explanation> */
import { Injectable, Logger } from '@nestjs/common';
import Sensor from 'node-dht-sensor';
import type { Relay, RelayName, RelayState } from '../lib/types';
import { SensorDataResponse } from './sensor.service';

@Injectable()
export class HardwareService {
	async getSensorData() {
		const sensorPromise = Sensor.promises;

		sensorPromise.setMaxRetries(10);
		if (process.env.NODE_ENV !== 'development') {
			const testOptions = {
				test: {
					fake: {
						temperature: this.getRandomNumber(20, 25),
						humidity: this.getRandomNumber(55, 60),
					},
				},
			};
			sensorPromise.initialize(testOptions);
		} else {
			sensorPromise.initialize(22, 4);
		}

		const data = await sensorPromise.read(22, 4);
		return {
			scale: 'C',
			temperature: data.temperature,
			humidity: data.humidity,
		};
		// return this.getAtmosphereData();
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
