import { Segmented as SegmentedComponent } from '@samisdat/ui-components/Segmented';
import { useState } from 'react';

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
};

// --- many options -----------------------------------------------------------------------------
// The typography preset switcher has 13 options; the pill wraps into an uneven second row.

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

// Proposals are story-local overrides of the existing markup (fieldset > label > input + span),
// doubled class for specificity over the component's own styles.
const proposalCss = `
  /* A: grid — equal cells, rows line up, outline becomes a rounded rectangle */
  .seg-grid.seg-grid fieldset {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
    gap: 2px;
    border-radius: 14px;
    width: 100%;
    box-sizing: border-box;
  }
  .seg-grid.seg-grid fieldset span {
    text-align: center;
    border-radius: 10px;
  }

  /* B: chips — no container, every option is its own pill, wrapping is just text flow */
  .seg-chips.seg-chips fieldset {
    border: 0;
    padding: 0;
    gap: 6px;
    border-radius: 0;
  }
  .seg-chips.seg-chips fieldset span {
    border: 1px solid var(--cs-border-muted, var(--color-border-muted));
  }
  .seg-chips.seg-chips fieldset input:checked + span {
    border-color: var(--cs-text-emphasis, var(--color-text-emphasis));
  }

  /* C: one scrolling row — keeps the segmented look, edges fade where more options hide */
  .seg-scroll.seg-scroll fieldset {
    display: flex;
    flex-wrap: nowrap;
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    box-sizing: border-box;
    mask-image: linear-gradient(to right, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%);
  }
  .seg-scroll.seg-scroll fieldset::-webkit-scrollbar {
    display: none;
  }
  .seg-scroll.seg-scroll fieldset span {
    white-space: nowrap;
  }
`;

const Controlled = ({ className, width }: { className?: string; width: number }) => {
    const [value, setValue] = useState('plex');
    return (
        <div
            className={className}
            style={{ width, maxWidth: '100%' }}
        >
            <SegmentedComponent
                label="Typography preset"
                value={value}
                options={presets}
                onChange={setValue}
            />
        </div>
    );
};

/** Today's component with 13 options: wraps inside one pill. */
export const Multiline: Story = {
    args: { label: 'Typography preset', value: 'plex', options: presets, onChange: () => {} },
    render: () => <Controlled width={720} />,
};

/** `variant="chips"`: the chosen layout for many options. */
export const Chips: Story = {
    args: { label: 'Typography preset', value: 'plex', options: presets, onChange: () => {}, variant: 'chips' },
    render: args => {
        const [value, setValue] = useState(args.value);
        return (
            <div style={{ width: 720, maxWidth: '100%' }}>
                <SegmentedComponent
                    {...args}
                    value={value}
                    onChange={setValue}
                />
            </div>
        );
    },
};

/** The three proposals at the same width, same data. */
export const MultilineProposals: Story = {
    args: Multiline.args,
    render: () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 32 }}>
            <style>{proposalCss}</style>
            {[
                ['A · Grid', 'seg-grid'],
                ['B · Chips', 'seg-chips'],
                ['C · Scrolling row', 'seg-scroll'],
            ].map(([title, cls]) => (
                <div key={cls}>
                    <p style={{ margin: '0 0 8px', fontSize: 14, color: 'var(--color-text-secondary)' }}>{title}</p>
                    <Controlled
                        className={cls}
                        width={720}
                    />
                </div>
            ))}
        </div>
    ),
};
