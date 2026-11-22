import { Segmented as SegmentedComponent } from '@samisdat/ui-components/Segmented';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Controls/Segmented',
    component: SegmentedComponent,
    tags: ['autodocs'],
    parameters: {},
} satisfies Meta<typeof SegmentedComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
    { value: 'default', label: 'default' },
    { value: 'raised', label: 'raised · highlight · selection' },
    { value: 'code', label: 'code' },
];

export const Segmented: Story = {
    args: {
        label: 'Gemessen auf',
        value: 'raised',
        options,
        onChange: () => {},
    },
    render: args => {
        const [value, setValue] = useState(args.value);
        return (
            <SegmentedComponent
                {...args}
                value={value}
                onChange={setValue}
            />
        );
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const group = canvas.getByRole('group', { name: 'Gemessen auf' });
        const raised = within(group).getByLabelText('raised · highlight · selection');
        await expect(raised).toBeChecked();

        // Pointer: picking another option moves the selection.
        await userEvent.click(within(group).getByLabelText('code'));
        await expect(within(group).getByLabelText('code')).toBeChecked();
        await expect(raised).not.toBeChecked();

        // Keyboard: arrow keys move the selection inside the radio group.
        await userEvent.keyboard('{ArrowLeft}');
        await expect(raised).toBeChecked();
        await expect(raised).toHaveFocus();
    },
};

// --- many options -----------------------------------------------------------------------------
// The typography preset switcher has 13 options. The pill stays on one row and scrolls.

const presets = [
    'current',
    'inter',
    'tight-inter',
    'editorial',
    'plex',
    'instrument',
    'bricolage',
    'literata',
    'garamond',
    'geist',
    'recursive',
    'alegreya',
    'bodoni',
].map(value => ({ value, label: value }));

const Controlled = ({ width }: { width: number }) => {
    const [value, setValue] = useState('plex');
    return (
        <div style={{ width, maxWidth: '100%' }}>
            <SegmentedComponent
                label="Typography preset"
                value={value}
                options={presets}
                onChange={setValue}
            />
        </div>
    );
};

const manyArgs = { label: 'Typography preset', value: 'plex', options: presets, onChange: () => {} };

/** 13 options in a container too narrow for them: one row, scrolls, fades only where content is hidden. */
export const ManyOptions: Story = {
    args: manyArgs,
    render: () => <Controlled width={720} />,
};

/** Phone width: the checked segment is kept in view, the focus ring is not clipped. */
export const Narrow: Story = {
    args: manyArgs,
    render: () => <Controlled width={320} />,
};
