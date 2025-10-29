import { useState } from 'react';

interface Temperature {
	scale: 'F' | 'C';
	value: string;
}

interface AtmosphereSettings {
	showHumidity: boolean;
}

/**
 * Atmosphere component should display temperature and humidity as well as the temperature scale (F/C).
 * A settings section should allow the user to switch between temperature scales and well as displaying and hiding humidity.
 */

const Atmosphere = () => {
	const [temperatureData, setTemperatureData] = useState<Temperature>({
		scale: 'F',
		value: '0',
	});
	const [humidityData, setHumidityData] = useState<string>('0');
	const [settings, setSettings] = useState<AtmosphereSettings>({
		showHumidity: true,
	});

	return (
		<div>
			<div className="">
				<div className="inline-block text-4xl">{temperatureData.value}</div>

				<div className="inline-block align-top pt-1">
					&deg;{temperatureData.scale}
				</div>
			</div>
			<div>{settings.showHumidity && humidityData}</div>
		</div>
	);
};

export default Atmosphere;
