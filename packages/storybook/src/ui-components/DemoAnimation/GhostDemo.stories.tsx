import { mouseDemoScript, padDemoScript, tiltDemoScript, touchDemoScript } from '@samisdat/ui-components/InteractionGhost';
import { DemoParallaxSectors } from '@samisdat/ui-components/Demo/Parallax/Sectors';
import { GhostDemo } from '@samisdat/ui-components/DemoAnimation/GhostDemo';

import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';

const meta = {
    title: 'Interaction/DemoAnimation/Ghost',
    component: GhostDemo,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    args: {
        script: padDemoScript,
        resumeAfterMs: 3500,
        loop: true,
        hint: 'Move the pointer (or touch the demo) to take over.',
        children: () => null,
    },
    argTypes: { script: { control: false }, children: { control: false } },
    decorators: [
        (Story) => (
            <div style={{ width: '100%', maxWidth: 520 }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof GhostDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

const sectors = (args: ComponentProps<typeof GhostDemo>) => (
    <GhostDemo {...args}>{(source) => <DemoParallaxSectors source={source} />}</GhostDemo>
);

export const Sectors: Story = { render: sectors };

export const Pad: Story = { render: sectors, args: { script: padDemoScript } };

export const Mouse: Story = { render: sectors, args: { script: mouseDemoScript } };

export const Touch: Story = { render: sectors, args: { script: touchDemoScript } };

export const Tilt: Story = { render: sectors, args: { script: tiltDemoScript } };

/** Defaults: no resume, no loop, speed slider can be switched on. */
export const PlainOnce: Story = {
    render: sectors,
    args: { resumeAfterMs: undefined, loop: false, speedControl: true },
};
