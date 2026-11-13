import { DemoParallaxSectors } from '@samisdat/ui-components/Demo/Parallax/Sectors';
import { GhostRecorder } from '@samisdat/ui-components/InteractionGhost';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'InteractionGhost/GhostRecorder',
    component: GhostRecorder,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    args: {
        device: 'pad',
        children: () => null,
    },
    argTypes: {
        device: { control: 'inline-radio', options: ['pad', 'touch', 'mouse'] },
        children: { control: false },
        onScript: { control: false },
    },
    decorators: [
        (Story) => (
            <div style={{ width: 450, maxWidth: '100%' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof GhostRecorder>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Authoring tool: record a gesture over the demo, tune the tolerance, copy the snippet. */
export const Sectors: Story = {
    render: (args) => <GhostRecorder {...args}>{(source) => <DemoParallaxSectors source={source} />}</GhostRecorder>,
};

export const Mouse: Story = {
    args: { device: 'mouse' },
    render: Sectors.render,
};
