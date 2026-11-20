import { type NormSource, useParallax } from '@samisdat/tools';
import { HillsView } from '@samisdat/ui-components/Demo/Parallax/HillsView';
import { DemoParallaxSectors } from '@samisdat/ui-components/Demo/Parallax/Sectors';
import { InteractionGhost, trackpadDemoScript } from '@samisdat/ui-components/InteractionGhost';

import { useRef } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

/** DemoParallaxHills without its grid, so the ghost overlay sits exactly on the picture. */
const HillsPicture = ({ source }: { source: NormSource }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    useParallax(ref, {}, source);

    return (
        <div ref={ref}>
            <HillsView />
        </div>
    );
};

const meta = {
    title: 'InteractionGhost/InteractionGhost',
    component: InteractionGhost,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    args: {
        script: trackpadDemoScript,
        playing: true,
        speed: 1,
        hint: 'Move the pointer (or touch the demo) to take over.',
        children: () => null,
    },
    argTypes: {
        playing: { control: 'boolean' },
        speed: { control: { type: 'range', min: 0.25, max: 4, step: 0.25 } },
        script: { control: false },
        children: { control: false },
    },
    decorators: [
        (Story) => (
            <div style={{ width: 450 }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof InteractionGhost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sectors: Story = {
    render: (args) => (
        <InteractionGhost {...args}>{(source) => <DemoParallaxSectors source={source} />}</InteractionGhost>
    ),
};

export const Hills: Story = {
    args: { aspectRatio: 450 / 600 },
    decorators: [
        (Story) => (
            <div style={{ width: 300 }}>
                <Story />
            </div>
        ),
    ],
    render: (args) => (
        <InteractionGhost {...args}>{(source) => <HillsPicture source={source} />}</InteractionGhost>
    ),
};
