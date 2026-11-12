import { GhostMarker } from '@samisdat/ui-components/InteractionGhost/GhostMarker';

import { Stage } from './Stage';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'InteractionGhost/GhostMarker',
    component: GhostMarker,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    args: { x: 75, y: 50, presence: 1, down: false, kind: 'touch' },
    argTypes: {
        presence: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
        x: { control: { type: 'range', min: 10, max: 120, step: 1 } },
        y: { control: { type: 'range', min: 10, max: 85, step: 1 } },
        kind: { control: 'inline-radio', options: ['pad', 'touch', 'mouse'] },
    },
    decorators: [
        Story => (
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
export const Touch: Story = { args: { kind: 'touch', down: true, age: 0.2 } };
export const Pad: Story = { args: { kind: 'pad' } };
export const Mouse: Story = { args: { kind: 'mouse' } };
export const MouseDown: Story = { args: { kind: 'mouse', down: true, age: 0.15 } };
export const CustomColor: Story = {
    args: { kind: 'mouse' },
    decorators: [
        Story => (
            <g style={{ ['--ghost-color' as string]: 'var(--color-ink-ruby)' }}>
                <Story />
            </g>
        ),
    ],
};
