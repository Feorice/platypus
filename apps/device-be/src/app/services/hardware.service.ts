/** biome-ignore-all lint/style/useImportType: <explanation> */
import { Injectable, Logger } from '@nestjs/common';
import Sensor from 'node-dht-sensor';
import { RIO } from 'rpi-io';
import type { Relay, RelayName, RelayState } from '../lib/types';

@Injectable()
export class HardwareService {
	async getSensorData() {
		const sensorPromise = Sensor.promises;
		sensorPromise.setMaxRetries(10);

		if (process.env.NODE_ENV === 'development') {
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
			sensorPromise.initialize(22, 17);
		}

		try {
			const data = await sensorPromise.read(22, 17);

			return {
				scale: 'C',
				temperature: data.temperature,
				humidity: data.humidity,
			};
		} catch (error) {
			Logger.error(error);
			return null;
		}
	}

	setRelay(level: number) {
		new RIO(18, 'output', { value: level });

		RIO.closeAll();
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
}
