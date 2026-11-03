import { DemoSmilMorphHills } from '@samisdat/ui-components/Demo/Smil/MorphHills';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Demo/Smil/MorphHills',
    component: DemoSmilMorphHills,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoSmilMorphHills>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
