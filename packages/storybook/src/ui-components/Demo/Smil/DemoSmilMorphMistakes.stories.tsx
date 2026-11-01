import { DemoSmilMorphMistakes } from '@samisdat/ui-components/Demo/Smil/MorphMistakes';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Demo/Smil/MorphMistakes',
    component: DemoSmilMorphMistakes,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoSmilMorphMistakes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
