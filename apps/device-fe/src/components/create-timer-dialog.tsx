import { zodResolver } from "@hookform/resolvers/zod";
import type { FormEventHandler } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type DateTimeRange, TimeRangePicker } from "./time-range-picker";

const formSchema = z.object({
	timeRange: z.object({ from: z.date(), to: z.date() }),
	enabled: z.boolean().nullable(),
	name: z.string().min(1, "Please enter a valid name."),
});

export function DialogDemo({
	onSubmit,
}: {
	onSubmit: (values: z.infer<typeof formSchema>) => void;
}) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			enabled: false,
			timeRange: {
				to: new Date(),
				from: new Date(),
			},
			name: "",
		},
	});

	function handleSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		onSubmit(values);
	}
	const handleChange = (e) => {
		console.log("handleChange", e);
	};
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Create</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						onChange={handleChange}
					>
						<DialogHeader>
							<DialogTitle>Create Timer</DialogTitle>
							<DialogDescription>
								Select time range for new timer and enable.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4">
							<div className="grid gap-3">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<Label htmlFor="timerRange">Timer Name</Label>
											<FormControl>
												<Input {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="timeRange"
									render={({ field }) => (
										<FormItem>
											<Label htmlFor="timerRange">Time Range</Label>
											<FormControl>
												<TimeRangePicker
													{...field}
													initialDateTo={field.value.to as Date}
													initialDateFrom={field.value.from as Date}
													onUpdate={(values) => {
														console.log("timeRange update", values.range);
														field.onChange(values.range);
													}}
													{...form.register("timeRange")}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="enabled"
									render={({ field }) => (
										<FormItem>
											<div className="flex items-center gap-3">
												<FormControl>
													<Checkbox
														checked={field.value ?? false}
														onCheckedChange={field.onChange}
														{...form.register("enabled")}
													/>
												</FormControl>
												<Label htmlFor="enabled">Enabled</Label>
											</div>
										</FormItem>
									)}
								/>
							</div>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Cancel</Button>
							</DialogClose>
							<Button type="submit">Create</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
