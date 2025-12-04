import { useGetTimersQuery } from "@state/api/data";
import { Timer } from "../components/Timer.tsx";

const TimersPage = () => {
	const { data } = useGetTimersQuery();

	const timersList = () => {
		return data?.timers?.map((timer) => (
			<div key={timer.id} className="w-100">
				<Timer timer />
			</div>
		));
	};
	return (
		<>
			<div>TIMERS PAGE</div>
			<div>{timersList()}</div>
		</>
	);
};

export default TimersPage;
