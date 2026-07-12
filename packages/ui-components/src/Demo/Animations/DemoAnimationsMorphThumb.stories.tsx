import type { Meta, StoryObj } from '@storybook/react';
import { DemoAnimationsMorphThumb } from './DemoAnimationsMorphThumb';

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
