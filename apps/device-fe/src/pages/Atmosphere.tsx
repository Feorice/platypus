import { Atmosphere } from "@klez/react-components";
import { useDHT22SensorEventsQuery } from "@state/api/socketApi.ts";

const AtmospherePage = () => {
	const { data: sensor } = useDHT22SensorEventsQuery();
	return (
		<Atmosphere
			title="Sensor"
			temperature={sensor?.temperature || 0}
			humidity={sensor?.humidity || 0}
			scale={sensor?.scale || "C"}
		/>
	);
};

export default AtmospherePage;
