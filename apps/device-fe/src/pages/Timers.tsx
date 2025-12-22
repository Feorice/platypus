import { useEnableTimerMutation, useGetTimersQuery } from '@state/api/data';
import {
	useCreateTimerMutation,
	useUpdateTimerMutation,
} from '@state/api/data.ts';
import type { ITimer } from '@/lib/types.ts';
import ClientClock from '../components/client-clock.tsx';
import { DialogDemo } from '../components/create-timer-dialog.tsx';
import { Timer } from '../components/Timer.tsx';

const TimersPage = () => {
	const { data } = useGetTimersQuery({ hidden: false });
	const [enableTimer, results] = useEnableTimerMutation();
	const [updateTimer, updateTimerResult] = useUpdateTimerMutation();
	const [createTimer, createTimerResult] = useCreateTimerMutation();

	const handleEnableTimer = (id: string, enabled: boolean) => {
		enableTimer({ id, enabled });
		console.log(`Enable timer with id ${id} ${enabled}`);
	};

	const onUpdateTimer = (update) => {
		console.log('update', update);
		if (update?.range) {
			const timer: Partial<ITimer> & Pick<ITimer, 'id'> = {
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
			relay: 'TEST_RELAY',
			name: event.name,
			isOn: false,
		};
		console.log('create timer event', event);
		createTimer(createData);
	};

	const timersList = () => {
		return data?.timers?.map((timer) => (
			<div key={timer.id} className="w-65 p-1">
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
			<div>TIMERS PAGE</div>
			<DialogDemo onSubmit={handleCreateTimer} />
			<ClientClock />

			<div className="flex flex-row">{timersList()}</div>
		</>
	);
};

export default TimersPage;
