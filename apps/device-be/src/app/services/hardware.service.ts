/** biome-ignore-all lint/style/useImportType: <explanation> */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Sensor from 'node-dht-sensor';
import { ModeType } from 'rpi-io';
import type { RelayName, RelayState } from '../lib/types';
import { RIO } from '../mocks/mockRIO';

let GPIO: typeof RIO;

// rpi-io is an optional package because it only supports linux.
// This is a workaround to allow us to mock the package when not on a linux os.
(async () => {
	try {
		// @ts-expect-error
		GPIO = (await import('rpi-io')).RIO;
	} catch {
		Logger.debug('Not a Raspberry PI platform. Using mock rpi-io.');
		GPIO = (await import('../mocks/mockRIO.js')).RIO;
	}
})();

@Injectable()
export class HardwareService {
	constructor(private configService: ConfigService) {}
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

	initializeRelays() {
		const relayOptions:
			| {
					name: 'RELAY_ONE' | 'RELAY_TWO' | 'RELAY_THREE' | 'RELAY_FOUR';
					pin: number;
					mode: ModeType;
					value: number;
			  }[]
			| undefined = this.configService.get('relayOptions');

		if (relayOptions?.length) {
			relayOptions.forEach((relay) => {
				Logger.debug(`Initializing ${relay.name} on pin ${relay.pin}`);
				new RIO(relay.pin, relay.mode, { value: relay.value });
			});

			return RIO.instances;
		}

		return undefined;
	}

	setRelay(pin: number, level: 0 | 1) {
		const relay = RIO.instances.get(pin);

		if (relay) {
			// Logger.debug(`Relay ${pin} relay level ${level}`);
			relay.write(level);
		}
	}

	setRelayState(relayName: RelayName, state: RelayState) {
		Logger.debug('setRelayState', { relayName, state });
	}

	private getRandomNumber = (min: number, max: number) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
}
