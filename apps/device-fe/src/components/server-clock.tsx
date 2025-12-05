import { useServerStatsEventsQuery } from "@state/api/socketApi.ts";

// import { useEffect, useState } from "react";
import { Activity } from "react";

const ServerClock = () => {
	const { data: serverStats } = useServerStatsEventsQuery();
	// const [currentTime, setCurrentTime] = useState(new Date());
	const time = serverStats?.localTime || "";

	// useEffect(() => {
	// 	const timer = setInterval(() => {
	// 		setCurrentTime(new Date());
	// 	}, 1000);
	//
	// 	// Cleanup interval on component unmount
	// 	return () => clearInterval(timer);
	// }, []);

	return (
		<div>
			<h1>Server Clock</h1>
			{/*<p>{currentTime.toLocaleTimeString()}</p>*/}
			<Activity mode={time ? "visible" : "hidden"}>
				<p>{new Date(time).toLocaleTimeString()}</p>
			</Activity>
		</div>
	);
};

export default ServerClock;
