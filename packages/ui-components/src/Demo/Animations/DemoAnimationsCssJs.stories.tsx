import type { Meta, StoryObj } from '@storybook/react';
import { DemoAnimationsCssJs } from './DemoAnimationsCssJs';

const meta = {
    title: 'Demo/Animations/CssJs',
    component: DemoAnimationsCssJs,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoAnimationsCssJs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
