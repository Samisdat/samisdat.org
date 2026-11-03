import { DemoSmilDisc } from '@samisdat/ui-components/Demo/Smil/Disc';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Demo/Smil/Disc',
    component: DemoSmilDisc,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoSmilDisc>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
