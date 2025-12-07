"use client";

import { format, isEqual, isValid } from "date-fns";
import { enUS, type Locale } from "date-fns/locale";
import { ChevronRightIcon, ClockIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TimeInput } from "./time-input";

export interface DateTimeRange {
	from: Date | undefined;
	to: Date | undefined;
}

export interface TimeRangePickerProps {
	onUpdate?: (values: { range: DateTimeRange }) => void;
	initialDateFrom?: Date | string;
	initialDateTo?: Date | string;
	align?: "start" | "center" | "end";
	locale?: Locale;
	className?: string;
}

const formatDateTime = (
	date: Date | undefined,
	locale: Locale = enUS,
): string => {
	if (!date || !isValid(date)) return "Select time";
	return format(date, "p", { locale });
};

const getDateAdjustedForTimezone = (
	dateInput: Date | string | undefined,
): Date | undefined => {
	if (!dateInput) return undefined;
	if (typeof dateInput === "string") {
		const parts = dateInput.split("-").map((part) => Number.parseInt(part, 10));
		return new Date(parts[0], parts[1] - 1, parts[2]);
	}
	const newDate = new Date(dateInput);
	return newDate;
};

export const TimeRangePicker: React.FC<TimeRangePickerProps> = ({
	initialDateFrom,
	initialDateTo,
	onUpdate,
	align = "center",
	locale = enUS,
	className,
}) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const [range, setRange] = React.useState<DateTimeRange>({
		from: getDateAdjustedForTimezone(initialDateFrom),
		to: getDateAdjustedForTimezone(initialDateTo),
	});
	const openedRangeRef = React.useRef<DateTimeRange>(range);

	const resetValues = (): void => {
		setRange({
			from: getDateAdjustedForTimezone(initialDateFrom),
			to: getDateAdjustedForTimezone(initialDateTo),
		});
	};

	const areRangesEqual = (a?: DateTimeRange, b?: DateTimeRange): boolean => {
		if (!a || !b) return a === b;
		return (
			isEqual(a.from || new Date(), b.from || new Date()) &&
			isEqual(a.to || new Date(), b.to || new Date())
		);
	};

	React.useEffect(() => {
		if (isOpen) {
			openedRangeRef.current = range;
		}
	}, [isOpen]);

	const handleFromDateTimeChange = (date: Date) => {
		setRange((prev) => ({ ...prev, from: date }));
	};

	const handleToDateTimeChange = (date: Date) => {
		setRange((prev) => ({ ...prev, to: date }));
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"w-full sm:w-[215px] justify-start text-left text-[11px] font-normal text-wrap",
						className,
					)}
				>
					<ClockIcon className="mr-2 h-4 w-4" />
					{formatDateTime(range.from, locale)}
					{range.to && (
						<>
							<ChevronRightIcon className="mx-2 h-4 w-4" />
							{formatDateTime(range.to, locale)}
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align={align} sideOffset={4}>
				<div className="flex flex-col lg:flex-row gap-4">
					{/* Time Section */}
					<div className="space-y-4 p-4">
						<div className="flex justify-between items-center">
							<TimeInput
								value={range.from}
								onChange={handleFromDateTimeChange}
								// label="Start"
							/>
							<ChevronRightIcon className="mx-2 h-4 w-4" />
							<TimeInput
								value={range.to}
								onChange={handleToDateTimeChange}
								// label="End"
							/>
						</div>
					</div>
				</div>

				{/* Footer Actions */}
				<div className="flex items-center justify-end gap-2 p-4 border-t">
					<Button
						variant="ghost"
						onClick={() => {
							setIsOpen(false);
							resetValues();
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							setIsOpen(false);
							if (!areRangesEqual(range, openedRangeRef.current)) {
								onUpdate?.({ range });
							}
						}}
					>
						Update
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
};

TimeRangePicker.displayName = "DateTimeRangePicker";
