type ModeType = 'input' | 'output' | 'pwm';
type BiasType = 'disabled' | 'pull-up' | 'pull-down';
type EdgeType = 'rising' | 'falling' | 'both';
interface Options {
	value?: number;
	bias?: BiasType;
	exportTime?: number;
	period?: number;
	dutyMin?: number;
	dutyMax?: number;
}

const defaultOptions: Options = {
	// output - Initial value
	value: 0,
	// input - Circuit bias: "disable", "pull-up", "pull-down"
	bias: 'disabled',
	// pwm - Delay time (ms) required on instance creation
	//			 depending on device performance. If this value is
	//       too small, the PWM instance creation fails.
	//			 Can be reduced for latest RPi 5
	//			 Must be increased for old RPi Zero.
	exportTime: 100,
	// pwm - period defined in μs. Default value is equivalent
	//			 to a 50 Hz frequency.
	period: 20000,
	// pwm - dutyMin and dutyMax defines the duty cycle use range in µs
	// 		   especially for servo-motors (See their specs!).
	dutyMin: 0,
	dutyMax: 20000,
};

// This mock is ONLY used when running backend on a system that doesn't support the rpi-io package.
// The rpi-io package relies on certain GPIO packages which are only available on the Raspberry PI.
// This only includes a mock of the main RIO class from rpi-io and not any of the other importable functions.
export class RIO {
	static instances: Map<number, RIO> = new Map();
	private readonly line: number;
	private readonly mode: ModeType;
	// @ts-expect-error
	private readonly options: Options;

	constructor(line: number, mode: ModeType, opt: Options = defaultOptions) {
		console.log('MOCK RIO CLASS');

		this.line = line;
		this.mode = mode;
		this.options = opt;

		RIO.instances.set(line, this);
	}

	close() {
		console.log('MOCK RIO close');
	}

	static closeAll() {
		console.log('MOCK RIO closeAll');
	}
	write(value: 0 | 1) {
		console.log('MOCK RIO write', { value, line: this.line, mode: this.mode });
	}
	read(): 0 | 1 {
		console.log('MOCK RIO read');
		return 0;
	}
	monitoringStart(callback: () => void, edge: EdgeType, bounce: number = 0) {}
	monitoringStop() {}
}
