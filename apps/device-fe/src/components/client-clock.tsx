import { useEffect, useState } from "react";

const ClientClock = () => {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		// Cleanup interval on component unmount
		return () => clearInterval(timer);
	}, []);

	return (
		<div>
			<h1>Client Clock</h1>
			<p>{currentTime.toLocaleTimeString()}</p>
		</div>
	);
};

export default ClientClock;
