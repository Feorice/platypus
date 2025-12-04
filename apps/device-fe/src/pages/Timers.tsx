import { useGetTimersQuery } from "@state/api/data";

const TimersPage = () => {
	const { data } = useGetTimersQuery();

	const timersList = () => {
		return data?.timers?.map((timer) => (
			<div key={timer.id}>{timer.relay}</div>
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
