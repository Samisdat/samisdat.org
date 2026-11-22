import { DemoSmilMorphMistakes } from '@samisdat/ui-components/Demo/Smil/MorphMistakes';

import { viewportModes } from '../../../../.storybook/chromaticModes';
import { exercisePlayback } from '../playbackPlay';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Demo/Smil/MorphMistakes',
    component: DemoSmilMorphMistakes,
    parameters: {
        chromatic: { modes: viewportModes },
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoSmilMorphMistakes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Autoplay in view, pause/play by pointer and keyboard, speed controls, reset. */
export const Playback: Story = {
    play: exercisePlayback(),
};
