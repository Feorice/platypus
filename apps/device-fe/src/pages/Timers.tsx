import { Timer } from "@klez/react-components";
import { useEnableTimerMutation, useGetTimersQuery } from "@state/api/data";
import { useUpdateTimerMutation } from "@state/api/data.ts";
import type { DateTimeRange } from "@/components/time-range-picker.tsx";
import type { ITimer } from "@/lib/types.ts";
import ClientClock from "../components/client-clock.tsx";

const TimersPage = () => {
	const { data } = useGetTimersQuery({ hidden: false });
	const [enableTimer] = useEnableTimerMutation();
	const [updateTimer] = useUpdateTimerMutation();

	const handleEnableTimer = (id: string, enabled: boolean) => {
		enableTimer({ id, enabled });
		console.log(`Enable timer with id ${id} ${enabled}`);
	};

	const onUpdateTimer = (update: { id: string; range: DateTimeRange }) => {
		console.log("update", update);
		if (update.range) {
			const timer: Partial<ITimer> & Pick<ITimer, "id"> = {
				id: update.id,
				startTime: update.range.from?.toString(),
				endTime: update.range.to?.toString(),
			};
			updateTimer(timer);
		}
	};

	const timersList = () => {
		return data?.timers?.map((timer) => (
			<div key={timer.id} className="w-75">
				<Timer
					onUpdate={onUpdateTimer}
					timer={timer}
					enableChange={handleEnableTimer}
				/>
			</div>
		));
	};
	return (
		<>
			<ClientClock />
			<div className="flex flex-wrap gap-6 justify-center pb-6">
				{timersList()}
			</div>
		</>
	);
};

export default TimersPage;
