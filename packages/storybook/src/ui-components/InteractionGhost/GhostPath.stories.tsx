import { GhostPath } from '@samisdat/ui-components/InteractionGhost/GhostPath';

import { Stage } from './Stage';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'InteractionGhost/GhostPath',
    component: GhostPath,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <Stage>
                <Story />
            </Stage>
        ),
    ],
} satisfies Meta<typeof GhostPath>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pan: Story = {
    args: {
        points: Array.from({ length: 20 }, (_, i) => ({ x: 25 + i * 5.5, y: 50 + Math.sin(i / 3) * 18 })),
    },
};
export const Tap: Story = { args: { points: [{ x: 75, y: 50 }] } };
