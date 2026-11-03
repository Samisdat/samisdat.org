import { DemoParallaxCircles } from '@samisdat/ui-components/Demo/Parallax/Circles';

import type { Meta, StoryObj } from '@storybook/react';

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
