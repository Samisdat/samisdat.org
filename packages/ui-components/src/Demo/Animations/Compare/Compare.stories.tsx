import type { Meta, StoryObj } from '@storybook/react';
import { DemoAnimationsCompare } from './index';

const meta = {
    title: 'Demo/Animations/Compare',
    component: DemoAnimationsCompare,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoAnimationsCompare>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
