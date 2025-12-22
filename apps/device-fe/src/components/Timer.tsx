import type { ComponentProps } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label.tsx";
import type { ITimer } from "@/lib/types.ts";
import { cn } from "@/lib/utils";
import {
	type DateTimeRange,
	TimeRangePicker,
} from "../components/time-range-picker.tsx";
import { Checkbox } from "../components/ui/checkbox.tsx";

export function Timer({
	className,
	timer,
	onUpdate,
	enableChange,
	...props
}: ComponentProps<"div"> & {
	timer: ITimer;
	enableChange: (id: string, enable: boolean) => void;
	onUpdate?: (values: { range: DateTimeRange; id: string }) => void;
}) {
	const handleCheckedChange = (checked: boolean) => {
		enableChange(timer.id, checked);
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">{timer.name}</CardTitle>
				</CardHeader>
				<CardContent>
					<form>
						<FieldGroup>
							<Field>
								<TimeRangePicker
									onUpdate={(update) =>
										onUpdate?.({ range: update.range, id: timer.id })
									}
									initialDateFrom={new Date(timer.startTime)}
									initialDateTo={new Date(timer.endTime)}
								/>

								<div className="flex items-center gap-3">
									{/** biome-ignore lint/correctness/useUniqueElementIds: <explanation> */}
									<Checkbox
										id="enabled"
										checked={timer.enabled}
										onCheckedChange={handleCheckedChange}
									/>
									<Label htmlFor="enable">Enable</Label>
								</div>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
