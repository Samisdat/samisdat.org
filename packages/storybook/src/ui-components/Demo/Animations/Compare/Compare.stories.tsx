import { DemoAnimationsCompare } from '@samisdat/ui-components/Demo/Animations/Compare';

import { exercisePlayback } from '../../playbackPlay';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Demo/Animations/Compare',
    component: DemoAnimationsCompare,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoAnimationsCompare>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Autoplay in view, pause/play by pointer and keyboard, speed controls, reset (which keeps the speed here). */
export const Playback: Story = {
    play: exercisePlayback({ resetsSpeed: false }),
};
