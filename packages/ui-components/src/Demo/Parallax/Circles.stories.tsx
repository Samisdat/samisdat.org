import type { Meta, StoryObj } from '@storybook/react';
import { DemoParallaxCircles } from './Circles';

const meta = {
    title: 'Demo/Parallax/Circles',
    component: DemoParallaxCircles,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoParallaxCircles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
