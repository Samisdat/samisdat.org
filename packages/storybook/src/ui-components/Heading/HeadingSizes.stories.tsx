import { Heading } from '@samisdat/ui-components/Heading';
import { Typo } from '@samisdat/ui-components/Typo';

import { PRESET_DATA, presetSizeStyle } from '../../../../website/src/lib/typography/data';

import type { Meta, StoryObj } from '@storybook/react';

// The sizes of a typography preset (fluid, driven by --t from the preview); fonts stay the site defaults.
const Sample = ({ presetId }: { presetId: string }) => {
    const preset = PRESET_DATA.find(({ id }) => id === presetId)!;

    return (
        <div style={presetSizeStyle(preset)}>
            <Heading level={1}>Heading 1</Heading>
            <Heading level={2}>Heading 2</Heading>
            <Heading level={3}>Heading 3</Heading>
            <p style={{ fontSize: 'var(--bz)' }}>
                <Typo variant="p">Body text at the preset's size.</Typo>
            </p>
        </div>
    );
};

const meta = {
    title: 'Typo/Heading sizes',
    component: Sample,
    parameters: { chromatic: { viewports: [360, 800, 1280] } },
} satisfies Meta<typeof Sample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Current: Story = { args: { presetId: 'current' } };
export const Inter: Story = { args: { presetId: 'inter' } };
