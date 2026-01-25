import { Atmosphere } from "@klez/react-components";
import { useSensorEventsQuery } from "@state/api/socketApi.ts";

const AtmospherePage = () => {
	const { data = [] } = useSensorEventsQuery();

	if (!data.length) {
		return <div>No sensor data.</div>;
	}

	return (
		<div className="flex justify-center mt-6">
			<div className="grid grid-cols-2 gap-6 justify-center">
				{data.map((data, index) => {
					const key = index + 1;
					return (
            <Atmosphere
							key={key}
							title="Sensor"
							temperature={data?.temperature || 0}
							humidity={data?.humidity || 0}
							scale={data?.scale || "C"}
						/>
					);
				})}
			</div>
		</div>
	);

	return <>No sensors found.</>;
};

export default AtmospherePage;
