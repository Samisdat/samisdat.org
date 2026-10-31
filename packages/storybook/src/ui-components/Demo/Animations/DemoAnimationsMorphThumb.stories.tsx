import { DemoAnimationsMorphThumb } from '@samisdat/ui-components/Demo/Animations/DemoAnimationsMorphThumb';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Demo/Animations/MorphThumb',
    component: DemoAnimationsMorphThumb,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoAnimationsMorphThumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
