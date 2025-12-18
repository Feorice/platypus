declare namespace RPIIO {
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

	class RIO {
		static instances: Map<number, RIO>;

		/** ------------------------------------------------------------------
		 * @method constructor
		 * @param {Number} line - BCM number
		 * @param {String} mode - "input", "output", "pwm"
		 * @param {Object} opt - misc options depending on mode
		 */
		constructor(line: number, mode: ModeType, opt?: Options);

		/** ------------------------------------------------------------------
		 * @method close
		 * @description To close line and free resources
		 */
		close(): void;

		/** ------------------------------------------------------------------
		 * @method write
		 * @description Write value to GPIO line
		 * @param {Number}  value
		 */
		write(value: 0 | 1): void;

		/** ------------------------------------------------------------------
		 * @method read
		 * @description Read value from GPIO line
		 * @return {Number} 0,1
		 */
		read(): 0 | 1;

		/** ------------------------------------------------------------------
		 * @method monitoringStart
		 * @description Monitor input GPIO line events (rising/falling)
		 * @param cb
		 * @param {String} edge
		 * @param {Number} bounce
		 */
		monitoringStart(
			cb: (event: EdgeType) => void,
			edge?: EdgeType,
			bounce?: number,
		): void;

		/** ------------------------------------------------------------------
		 * @method monitoringStop
		 * @description Stop event monitoring
		 */
		monitoringStop(): void;

		/** --------------------------------------------------------------
		 * @method pwmStop
		 * @description Stop PWM modulation
		 */
		pwmStop(): void;

		/** --------------------------------------------------------------
		 * @method pwmDuty
		 * @description Change PWM duty cycle
		 * @param {Number} percent 0 <= percent  <= 100
		 */
		pwmDuty(percent: number): void;

		/** ------------------------------------------------------------------
		 * @method RIO.closeAll
		 * @description Static method to close all instances
		 */
		static closeAll(): void;
	}

	/** ------------------------------------------------------------------
	 * @function traceCfg
	 * @description Set log configuration
	 * @param {Number} level    0: no log, 1: warn only, 2: warn and log
	 */
	function traceCfg(level: 0 | 1 | 2): void;

	/** ------------------------------------------------------------------
	 * @function log
	 * @description Global customized timestamped console.log
	 *              Requires global variable 'debug'
	 */
	function log(): void;

	/** ------------------------------------------------------------------
	 * @function warn
	 * @description Colored log for error messages ⚠️ nodejs only ~ CSS color #F50
	 */
	function warn(): void;

	/** ------------------------------------------------------------------
	 * @function sleep
	 * @description Wait before continuing
	 * @param {Number} ms
	 * @param {Boolean} track
	 */
	function sleep(ms: number, track?: boolean): Promise<void>;

	/** ------------------------------------------------------------------
	 * @function ctrlC
	 * @description Intercept ctrl+c then exec callback
	 * @param cb
	 */
	function ctrlC(cb: () => void): void;

	/** ------------------------------------------------------------------
	 * @function lineConfig
	 * @description Return line configuration
	 * @param {Number} line
	 * @return {String}
	 */
	function lineConfig(line: number): string;

	/** ------------------------------------------------------------------
	 * @function lineNumber
	 * @description Return nth process argument and check it is a number
	 * @param {Number} nth
	 * @return {Number}
	 */
	function lineNumber(nth: number): number;
}

export = RPIIO;
export as namespace RPIIO;
