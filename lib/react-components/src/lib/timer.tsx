import {
	addDays,
	formatDistance,
	getHours,
	getMinutes,
	isAfter,
	isBefore,
	set,
} from 'date-fns';
import type { ComponentProps } from 'react';
import { Activity } from 'react';
import type { ITimer } from '@/lib/types.ts';
import {
	type DateTimeRange,
	TimeRangePicker,
} from '@/shadcn/components/time-range-picker';
import { Button } from '@/shadcn/components/ui/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/shadcn/components/ui/card';
import { Label } from '@/shadcn/components/ui/label';
import { Separator } from '@/shadcn/components/ui/separator';
import { Switch } from '@/shadcn/components/ui/switch';
import { cn } from '@/shadcn/lib/utils';

export function Timer({
	className,
	timer,
	onUpdate,
	enableChange,
	...props
}: ComponentProps<'div'> & {
	timer: ITimer;
	enableChange: (id: string, enable: boolean) => void;
	onUpdate?: (values: { range: DateTimeRange; id: string }) => void;
}) {
	const handleCheckedChange = (checked: boolean) => {
		enableChange(timer.id, checked);
	};

	const timerStatus = () => {
		if (!timer.enabled) {
			return 'Disabled';
		}

		const currentTime = new Date();
		let startTime = set(currentTime, {
			hours: getHours(timer.startTime),
			minutes: getMinutes(timer.startTime),
		});
		let endTime = set(currentTime, {
			hours: getHours(timer.endTime),
			minutes: getMinutes(timer.endTime),
		});

		if (startTime > endTime) {
			endTime = addDays(endTime, 1);
		}

		if (currentTime > endTime) {
			startTime = addDays(startTime, 1);
		}
		//debugger;
		if (isAfter(currentTime, startTime) && isBefore(currentTime, endTime)) {
			return `Stops in ${formatDistance(currentTime, endTime)}`;
		} else {
			return `Starts in ${formatDistance(currentTime, startTime)}`;
		}
	};

	return (
		<div className={cn('flex flex-col gap-6 max-w-75', className)} {...props}>
			<Card className={'dark:bg-gray-800 gap-4'}>
				<CardHeader className="text-center gap-0">
					<CardTitle
						data-testid="title"
						className="subpixel-antialiased scroll-m-20 text-xl font-semibold tracking-tight"
					>
						{timer?.name}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4">
						<div className="[&>*]:w-full">
							<TimeRangePicker
								onUpdate={(update) =>
									onUpdate?.({ range: update.range, id: timer.id })
								}
								initialDateFrom={new Date(timer?.startTime)}
								initialDateTo={new Date(timer?.endTime)}
							/>
						</div>

						<div className="flex justify-between">
							{/* Enable Section */}
							<div className="flex items-center space-x-2">
								<Switch
									checked={timer.enabled}
									onCheckedChange={handleCheckedChange}
									id="enable"
								/>
								<Label htmlFor="enable">Enable</Label>
							</div>
							{/* Manual Turn On Section */}
							<div>
								<Button>Turn On</Button>
							</div>
						</div>

						<Activity mode={timerStatus() ? 'visible' : 'hidden'}>
							<div className="text-center">
								<div className="font-semibold">Status</div>
								<Separator />
								<div className="mt-2">{timerStatus()}</div>
							</div>
						</Activity>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
