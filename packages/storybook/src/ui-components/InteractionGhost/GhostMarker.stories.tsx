import { GhostMarker } from '@samisdat/ui-components/InteractionGhost/GhostMarker';

import { Stage } from './Stage';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'InteractionGhost/GhostMarker',
    component: GhostMarker,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    args: { x: 75, y: 50, presence: 1, down: false },
    argTypes: { presence: { control: { type: 'range', min: 0, max: 1, step: 0.01 } } },
    decorators: [
        (Story) => (
            <Stage>
                <Story />
            </Stage>
        ),
    ],
} satisfies Meta<typeof GhostMarker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hover: Story = {};
export const Down: Story = { args: { down: true } };
export const Fading: Story = { args: { presence: 0.4 } };
