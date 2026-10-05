import type { Meta, StoryObj } from '@storybook/react';
import { DemoParallaxHills } from '@samisdat/demos/Parallax/Hills';

const meta = {
    title: 'Demo/Parallax/Hills',
    component: DemoParallaxHills,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoParallaxHills>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
