import { DemoAnimationsCssJs } from '@samisdat/ui-components/Demo/Animations/DemoAnimationsCssJs';

import { exercisePlayback } from '../playbackPlay';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Demo/Animations/CssJs',
    component: DemoAnimationsCssJs,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoAnimationsCssJs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Autoplay in view, pause/play by pointer and keyboard, speed controls, reset. */
export const Playback: Story = {
    play: exercisePlayback(),
};
