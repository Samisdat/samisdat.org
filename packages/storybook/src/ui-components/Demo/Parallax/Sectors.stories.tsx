import { DemoParallaxSectors } from '@samisdat/ui-components/Demo/Parallax/Sectors';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Demo/Parallax/Sectors',
    component: DemoParallaxSectors,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoParallaxSectors>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
