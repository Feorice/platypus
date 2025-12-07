import { useGetTimersQuery } from "@state/api/data";
import {
	useCreateTimerMutation,
	useUpdateTimerMutation,
} from "@state/api/data.ts";
import type { ITimer } from "@/lib/types.ts";
import ClientClock from "../components/client-clock.tsx";
import { DialogDemo } from "../components/create-timer-dialog.tsx";
import { Timer } from "../components/Timer.tsx";

const TimersPage = () => {
	const { data } = useGetTimersQuery();
	const [updateTimer, updateTimerResult] = useUpdateTimerMutation();
	const [createTimer, createTimerResult] = useCreateTimerMutation();

	const onUpdateTimer = (update) => {
		console.log("update", update);
		if (update?.range) {
			const timer: Partial<ITimer> & Pick<ITimer, "id"> = {
				id: update.id,
				startTime: update.range.from,
				endTime: update.range.to,
			};
			updateTimer(timer);
		}
	};

	const handleCreateTimer = (event) => {
		const createData: ITimer = {
			startTime: event.timeRange.from,
			endTime: event.timeRange.to,
			enabled: event.enabled,
			relay: "TEST_RELAY",
			name: event.name,
			isOn: false,
		};
		console.log("create timer event", event);
		createTimer(createData);
	};

	const timersList = () => {
		return data?.timers?.map((timer) => (
			<div key={timer.id} className="w-100">
				<Timer onUpdate={onUpdateTimer} timer={timer} />
			</div>
		));
	};
	return (
		<>
			<div>TIMERS PAGE</div>
			<DialogDemo onSubmit={handleCreateTimer} />
			<ClientClock />

			<div>{timersList()}</div>
		</>
	);
};

export default TimersPage;
