import { DemoSmilSchwebebahn } from '@samisdat/ui-components/Demo/Smil/Schwebebahn';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Demo/Smil/Schwebebahn',
    component: DemoSmilSchwebebahn,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoSmilSchwebebahn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
