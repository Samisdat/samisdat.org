import { DemoSmilMorphHills } from '@samisdat/ui-components/Demo/Smil/MorphHills';

import { viewportModes } from '../../../../.storybook/chromaticModes';
import { exercisePlayback } from '../playbackPlay';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Demo/Smil/MorphHills',
    component: DemoSmilMorphHills,
    parameters: {
        chromatic: { modes: viewportModes },
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoSmilMorphHills>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Autoplay in view, pause/play by pointer and keyboard, speed controls, reset. */
export const Playback: Story = {
    play: exercisePlayback(),
};
