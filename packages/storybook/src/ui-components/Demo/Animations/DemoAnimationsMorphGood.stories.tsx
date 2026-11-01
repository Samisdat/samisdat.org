import { DemoAnimationsMorphGood } from '@samisdat/ui-components/Demo/Animations/DemoAnimationsMorphGood';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Demo/Animations/MorphGood',
    component: DemoAnimationsMorphGood,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoAnimationsMorphGood>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
