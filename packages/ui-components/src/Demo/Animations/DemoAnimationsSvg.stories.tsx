import type { Meta, StoryObj } from '@storybook/react';
import { DemoAnimationsSvg } from './DemoAnimationsSvg';

const meta = {
    title: 'Demo/Animations/Svg',
    component: DemoAnimationsSvg,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoAnimationsSvg>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
