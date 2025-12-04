import { useDHT22SensorEventsQuery } from "@state/api/socketApi";

const Atmosphere = () => {
	const { data: sensor } = useDHT22SensorEventsQuery();

	return (
		<>
			<div>{sensor?.temperature}</div>
			<div>{sensor?.humidity}</div>
		</>
	);
};

export default Atmosphere;
