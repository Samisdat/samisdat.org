import { DemoAnimationsJsAttributes } from '@samisdat/ui-components/Demo/Animations/DemoAnimationsJsAttributes';

import { exercisePlayback } from '../playbackPlay';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Demo/Animations/JsAttributes',
    component: DemoAnimationsJsAttributes,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoAnimationsJsAttributes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Autoplay in view, pause/play by pointer and keyboard, speed controls, reset. */
export const Playback: Story = {
    play: exercisePlayback(),
};
