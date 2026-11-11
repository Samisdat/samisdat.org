import { trackpadDemoScript } from '@samisdat/ui-components/InteractionGhost';
import { DemoParallaxSectors } from '@samisdat/ui-components/Demo/Parallax/Sectors';
import { GhostDemo } from '@samisdat/ui-components/DemoAnimation/GhostDemo';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Interaction/DemoAnimation/Ghost',
    component: GhostDemo,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    args: {
        script: trackpadDemoScript,
        hint: 'Move the pointer (or touch the demo) to take over.',
        children: () => null,
    },
    argTypes: { script: { control: false }, children: { control: false } },
    decorators: [
        (Story) => (
            <div style={{ width: 520 }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof GhostDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sectors: Story = {
    render: (args) => <GhostDemo {...args}>{(source) => <DemoParallaxSectors source={source} />}</GhostDemo>,
};
