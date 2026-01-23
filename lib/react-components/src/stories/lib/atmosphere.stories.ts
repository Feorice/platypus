import type { Meta, StoryObj } from '@storybook/react-vite';
import Atmosphere from '../../lib/atmosphere';

const meta = {
	component: Atmosphere,
	title: 'Atmosphere',
} satisfies Meta<typeof Atmosphere>;
export default meta;

type Story = StoryObj<typeof Atmosphere>;

export const Primary = {
	args: {
		title: "Luna's Sensor",
		temperature: '25',
		humidity: '50',
		scale: 'F',
	},
} satisfies Story;
