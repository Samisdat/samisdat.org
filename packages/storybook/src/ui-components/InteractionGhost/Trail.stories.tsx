import { Trail } from '@samisdat/ui-components/InteractionGhost/Trail';

import { Stage } from './Stage';

import type { Meta, StoryObj } from '@storybook/react';

const points = Array.from({ length: 19 }, (_, i) => ({
    x: 25 + i * 5.5,
    y: 50 + Math.sin(i / 3) * 18,
}));

const meta = {
    title: 'InteractionGhost/Trail',
    component: Trail,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    args: { points, presence: 1 },
    argTypes: { presence: { control: { type: 'range', min: 0, max: 1, step: 0.01 } } },
    decorators: [
        (Story) => (
            <Stage>
                <Story />
            </Stage>
        ),
    ],
} satisfies Meta<typeof Trail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Short: Story = { args: { points: points.slice(0, 6) } };
