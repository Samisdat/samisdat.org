import type { Meta, StoryObj } from '@storybook/react';
import { DemoParallaxHills } from './Hills';

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
