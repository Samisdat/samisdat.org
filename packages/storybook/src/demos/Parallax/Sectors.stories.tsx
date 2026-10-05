import type { Meta, StoryObj } from '@storybook/react';
import { DemoParallaxSectors } from '@samisdat/demos/Parallax/Sectors';

const meta = {
    title: 'Demos/Parallax/Sectors',
    component: DemoParallaxSectors,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoParallaxSectors>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
