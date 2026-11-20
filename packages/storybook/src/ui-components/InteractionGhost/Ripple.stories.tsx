import { Ripple } from '@samisdat/ui-components/InteractionGhost/Ripple';

import { Stage } from './Stage';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'InteractionGhost/Ripple',
    component: Ripple,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    args: { x: 75, y: 50, progress: 0.3 },
    argTypes: { progress: { control: { type: 'range', min: 0, max: 1, step: 0.01 } } },
    decorators: [
        (Story) => (
            <Stage>
                <Story />
            </Stage>
        ),
    ],
} satisfies Meta<typeof Ripple>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Start: Story = { args: { progress: 0 } };
export const Late: Story = { args: { progress: 0.85 } };
