import {
	Droplet as DropletIcon,
	Thermometer as ThermometerIcon,
} from 'lucide-react';
import type { ComponentProps } from 'react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/shadcn/components/ui/card';
import { cn } from '@/shadcn/lib/utils.ts';

const Atmosphere = ({
	className,
	title,
	temperature,
	humidity,
	scale,
	...props
}: ComponentProps<'div'> & {
	title: string;
	temperature: string;
	humidity: string;
	scale: 'C' | 'F';
}) => {
	const formattedTemperature =
		scale === 'F'
			? ((9 / 5) * parseInt(temperature, 10) + 32).toString()
			: temperature;

	return (
		<div className={cn('flex flex-col gap-6 max-w-75', className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle>{title || 'SENSOR'}</CardTitle>
				</CardHeader>

				<CardContent>
					<div className="flex justify-center gap-2">
						<Temperature temperature={formattedTemperature} scale={scale} />
						<Humidity humidity={humidity} />
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

const Temperature = ({
	temperature,
	scale,
}: {
	temperature: string;
	scale: 'C' | 'F';
}) => {
	return (
		<div className="flex">
			<div className="flex items-center">
				<div className="leading-6">
					<ThermometerIcon fill="oklch(80% 0.191 22.216)" />
				</div>
				<div className="subpixel-antialiased scroll-m-20 text-4xl tracking-tight">
					{temperature}
				</div>
			</div>

			<div className="subpixel-antialiased scroll-m-20 text-md tracking-tight leading-6">
				&deg;{scale}
			</div>
		</div>
	);
};

const Humidity = ({ humidity }: { humidity: string }) => {
	return (
		<div className="flex items-center">
			<div>
				<DropletIcon fill="oklch(80% 0.165 254.624)" />
			</div>
			<div className="subpixel-antialiased scroll-m-20 text-xl tracking-tight">
				{humidity}%
			</div>
		</div>
	);
};

export default Atmosphere;
