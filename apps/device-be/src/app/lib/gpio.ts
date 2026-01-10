import { Logger } from '@nestjs/common';

let GPIO: typeof import('rpi-io').RIO;

// rpi-io is an optional package because it only supports linux.
// This is a workaround to allow us to mock the package when not on a linux os.
(async () => {
	try {
		GPIO = (await import('rpi-io')).RIO;
	} catch (error) {
		Logger.debug('Not a Raspberry PI platform. Using mock rpi-io.');
		GPIO = (await import('../mocks/mockRIO.js')).RIO;
	}
})();

export { GPIO };
