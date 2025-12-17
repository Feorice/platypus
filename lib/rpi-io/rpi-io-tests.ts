import {
	ctrlC,
	type EdgeType,
	lineConfig,
	lineNumber,
	log,
	RIO,
	sleep,
	traceCfg,
	warn,
} from 'rpi-io';

const cbTestOne = (event: EdgeType) => {};

const cbTestTwo = () => {};

const rio = new RIO(27, 'input', {
	value: 0,
	bias: 'disabled',
	dutyMin: 0,
	dutyMax: 20000,
	period: 20000,
	exportTime: 100,
});

rio.read();
rio.write(1);
rio.write(0);
rio.pwmDuty(1);
rio.pwmStop();
rio.monitoringStart(cbTestOne, 'both', 0);
rio.monitoringStop();

const rioInstance = RIO.instances.get(27);

rio.close();
RIO.closeAll();

log();
warn();
ctrlC(cbTestTwo);
lineConfig(27);
lineNumber(27);
traceCfg(0);
traceCfg(1);
traceCfg(2);

const asyncTests = async () => {
	await sleep(1000, true);
};

asyncTests().then(() => {});
