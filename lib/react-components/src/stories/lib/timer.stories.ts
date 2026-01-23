import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Timer } from '../../lib/timer';

const meta = {
	component: Timer,
	title: 'Timer',
} satisfies Meta<typeof Timer>;
export default meta;

type Story = StoryObj<typeof Timer>;

export const Primary = {
	args: {
		timer: {
			id: '12345',
			name: 'TEST TIMER 1',
			startTime: new Date('2026-01-22T14:30:00.000Z').toString(),
			endTime: new Date('2026-01-22T23:30:00.000Z').toString(),
			enabled: false,
		},
		enableChange: () => {},
		onUpdate: () => {},
	},
} satisfies Story;

export const Heading = {
	args: {
		timer: {
			id: '12345',
			name: 'TEST TIMER 1',
			startTime: new Date().toString(),
			endTime: new Date().toString(),
			enabled: false,
		},
		enableChange: () => {},
		onUpdate: () => {},
	},
	play: async ({ canvas }) => {
		await expect(canvas.getByTestId('title')).toContainHTML('TEST TIMER 1');
	},
} satisfies Story;
