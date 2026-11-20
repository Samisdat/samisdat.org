import { DeviceSketch } from '@samisdat/ui-components/InteractionGhost/devices/DeviceSketch';

import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

type DeviceFrame = ComponentProps<typeof DeviceSketch>['frame'];

type Args = {
    kind: 'pad' | 'mouse' | 'touch' | 'tilt';
    x: number;
    y: number;
    down: boolean;
    betaDeg: number;
    gammaDeg: number;
    dimmed: boolean;
};

const toFrame = ({ x, y, down, betaDeg, gammaDeg }: Args): DeviceFrame => ({
    norm: { x, y },
    finger: { x, y, presence: 1, down, age: down ? 200 : Infinity },
    press: { down, age: down ? 200 : Infinity },
    tilt: { beta: (betaDeg * Math.PI) / 180, gamma: (gammaDeg * Math.PI) / 180 },
});

const panel = (dark: boolean) => ({
    display: 'inline-block',
    padding: '1rem',
    border: '1px solid var(--color-border-default)',
    color: 'var(--color-surface-default)',
    backgroundColor: dark ? 'var(--color-ink-gold)' : 'var(--color-ink-rose)',
});

const range = { control: { type: 'range', min: -1, max: 1, step: 0.01 } } as const;

const meta = {
    title: 'InteractionGhost/DeviceSketch',
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    args: { kind: 'pad', x: 0.3, y: -0.2, down: false, betaDeg: 15, gammaDeg: -20, dimmed: false },
    argTypes: {
        kind: { control: 'inline-radio', options: ['pad', 'mouse', 'touch', 'tilt'] },
        x: range,
        y: range,
        betaDeg: { control: { type: 'range', min: -30, max: 30, step: 1 } },
        gammaDeg: { control: { type: 'range', min: -30, max: 30, step: 1 } },
    },
    render: (args) => (
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={panel(true)}>
                <DeviceSketch kind={args.kind} frame={toFrame(args)} dimmed={args.dimmed} />
            </div>
            <div style={panel(false)}>
                <DeviceSketch kind={args.kind} frame={toFrame(args)} dimmed={args.dimmed} />
            </div>
        </div>
    ),
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pad: Story = {};
export const PadDown: Story = { args: { kind: 'pad', down: true } };
export const Mouse: Story = { args: { kind: 'mouse' } };
export const MouseClick: Story = { args: { kind: 'mouse', down: true } };
export const Touch: Story = { args: { kind: 'touch', down: true } };
export const Tilt: Story = { args: { kind: 'tilt', betaDeg: 20, gammaDeg: -25 } };
export const Dimmed: Story = { args: { kind: 'touch', dimmed: true } };
