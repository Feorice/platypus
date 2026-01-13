import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timer  } from '../../lib/timer';
import { expect } from 'storybook/test';

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
      startTime: new Date().toString(),
      endTime: new Date().toString(),
      enabled: false,
    },
    enableChange: () => {},
    onUpdate: () => {},
  },
} satisfies Story;

export const Heading = {
  args: {
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/ReactComponents/gi)).toBeTruthy();
  },
} satisfies Story;

