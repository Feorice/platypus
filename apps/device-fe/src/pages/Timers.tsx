import { useGetTimersQuery } from "@state/api/data";
import ClientClock from "../components/client-clock.tsx";
import ServerClock from "../components/server-clock.tsx";
import { Timer } from "../components/Timer.tsx";
import { TimeRangePicker } from "../components/time-range-picker.tsx";

const TimersPage = () => {
	const { data } = useGetTimersQuery();

	const timersList = () => {
		return data?.timers?.map((timer) => (
			<div key={timer.id} className="w-100">
				<Timer timer={timer} />
			</div>
		));
	};
	return (
		<>
			<div>TIMERS PAGE</div>
			<ClientClock />
			<ServerClock />

			<div>{timersList()}</div>
		</>
	);
};

export default TimersPage;
