import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReactComponents  } from '../../lib/react-components';
import { expect } from 'storybook/test';

const meta = {
  component: ReactComponents,
  title: 'ReactComponents',
} satisfies Meta<typeof ReactComponents>;
export default meta;

type Story = StoryObj<typeof ReactComponents>;

export const Primary = {
  args: {
  },
} satisfies Story;

export const Heading = {
  args: {
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/ReactComponents/gi)).toBeTruthy();
  },
} satisfies Story;

