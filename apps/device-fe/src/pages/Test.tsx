import {
	type DHT22Data,
	useDHT22SensorEventsQuery,
} from "@state/api/socketApi.ts";
import AtmosphereStateless from "../components/AtmosphereStateless.tsx";

const Test = () => {
	const sensor = useDHT22SensorEventsQuery<DHT22Data>();
	return (
		<div>
			<AtmosphereStateless temperature={sensor?.temperature} />
		</div>
	);
};

export default Test;
