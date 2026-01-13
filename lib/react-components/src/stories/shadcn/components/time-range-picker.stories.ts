import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { TimeRangePicker } from '../../../shadcn/components/time-range-picker'

const meta = {
  component: TimeRangePicker,
  title: 'TimeRangePicker',
} satisfies Meta<typeof TimeRangePicker>;
export default meta;

type Story = StoryObj<typeof TimeRangePicker>;

export const Primary = {
  args: {
  },
} satisfies Story;

export const StartTime = {
  args: {
    initialDateFrom: new Date('2020-03-01'),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/6:00 PM/gi)).toBeTruthy();
  },
} satisfies Story;

export const EndTime = {
  args: {
    initialDateTo: new Date('2020-03-01'),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/6:00 PM/gi)).toBeTruthy();
  },
} satisfies Story;

export const FullRange = {
  args: {
    initialDateFrom: new Date('2020-03-01'),
    initialDateTo: new Date('2020-03-01'),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/6:00 PM/gi)).toBeTruthy();
  },
} satisfies Story;
