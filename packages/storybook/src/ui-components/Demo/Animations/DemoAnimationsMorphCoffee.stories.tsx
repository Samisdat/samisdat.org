import { DemoAnimationsMorphCoffee } from '@samisdat/ui-components/Demo/Animations/DemoAnimationsMorphCoffee';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Demo/Animations/MorphCoffee',
    component: DemoAnimationsMorphCoffee,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoAnimationsMorphCoffee>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
