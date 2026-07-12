import type { Meta, StoryObj } from '@storybook/react';
import { DemoAnimationsMorphUgly } from './DemoAnimationsMorphUgly';

const meta = {
    title: 'Demo/Animations/MorphUgly',
    component: DemoAnimationsMorphUgly,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoAnimationsMorphUgly>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
