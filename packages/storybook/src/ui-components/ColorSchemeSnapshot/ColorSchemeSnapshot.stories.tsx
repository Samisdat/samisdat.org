import {
    ColorSchemeSnapshot,
    SnapshotCode,
    SnapshotCvd,
    SnapshotDistinct,
    SnapshotEditor,
    SnapshotExceptions,
    SnapshotInks,
    SnapshotMatrix,
    SnapshotModes,
    SnapshotScales,
} from '@samisdat/ui-components/ColorSchemeSnapshot';
import { Component, type ReactNode } from 'react';
import { expect, userEvent, within } from 'storybook/test';

import snapshotJson from '../../../../website/content/snapshots/2026-10b.json';

import type { Snapshot } from '@samisdat/color-scheme/snapshot-types';
import type { Meta, StoryObj } from '@storybook/react';

// The same frozen file the website renders, so the blocks are exercised with real data.
const data = snapshotJson as unknown as Snapshot;

const meta = {
    title: 'Color Scheme/Snapshot',
    component: ColorSchemeSnapshot,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: { data },
} satisfies Meta<typeof ColorSchemeSnapshot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Frame: Story = {
    render: args => (
        <ColorSchemeSnapshot {...args}>
            <p>Frozen content</p>
        </ColorSchemeSnapshot>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const figure = canvasElement.querySelector('figure');

        await expect(figure).toHaveAttribute('data-snapshot', data.id);
        await expect(canvas.getByText(data.date, { exact: false })).toBeVisible();
    },
};

/** Picking a mode freezes the frame to it: the body switches to that mode's tokens. */
export const ModeSwitch: Story = {
    render: args => (
        <ColorSchemeSnapshot {...args}>
            <p>Frozen content</p>
        </ColorSchemeSnapshot>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const body = canvasElement.querySelector('figure > div') as HTMLElement;

        await userEvent.click(canvas.getByLabelText('Light'));
        await expect(canvas.getByLabelText('Light')).toBeChecked();
        await expect(body.style.getPropertyValue('--cs-surface-default')).toBe(
            data.modes.light.colors['surface.default']
        );

        await userEvent.click(canvas.getByLabelText('Dark'));
        await expect(canvas.getByLabelText('Dark')).toBeChecked();
        await expect(body.style.getPropertyValue('--cs-surface-default')).toBe(
            data.modes.dark.colors['surface.default']
        );
    },
};

/** A dirty working tree is marked with a plus after the commit. */
export const DirtyStamp: Story = {
    args: { data: { ...data, git: { commit: 'abc1234', dirty: true } } },
    render: args => <ColorSchemeSnapshot {...args} />,
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText(/abc1234\+/)).toBeVisible();
    },
};

class Boundary extends Component<{ children: ReactNode }, { message: string | null }> {
    state = { message: null as string | null };

    static getDerivedStateFromError(error: Error) {
        return { message: error.message };
    }

    render() {
        return this.state.message === null ? this.props.children : <p role="alert">{this.state.message}</p>;
    }
}

/** Blocks render only inside a frame; without one the hook fails loudly. */
export const BlockOutsideFrame: Story = {
    render: () => (
        <Boundary>
            <SnapshotScales title="Orphan" />
        </Boundary>
    ),
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole('alert')).toHaveTextContent(
            'Snapshot blocks must be placed inside <ColorSchemeSnapshot>'
        );
    },
};

export const Inks: Story = {
    render: args => (
        <ColorSchemeSnapshot {...args}>
            <SnapshotInks title="Tinten">Contrast per accent colour.</SnapshotInks>
        </ColorSchemeSnapshot>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await expect(canvas.getByRole('heading', { name: 'Tinten' })).toBeVisible();
        const surfaces = canvas.getAllByRole('radio');
        await expect(surfaces[0]).toBeChecked();

        await userEvent.click(surfaces[1]);
        await expect(surfaces[1]).toBeChecked();
        await expect(surfaces[0]).not.toBeChecked();
    },
};

export const Matrix: Story = {
    render: args => (
        <ColorSchemeSnapshot {...args}>
            <SnapshotMatrix title="Text auf Flächen" />
        </ColorSchemeSnapshot>
    ),
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole('heading', { name: 'Text auf Flächen' })).toBeVisible();
        await expect(canvasElement.querySelector('table')).not.toBeNull();
    },
};

export const Code: Story = {
    render: args => (
        <ColorSchemeSnapshot {...args}>
            <SnapshotCode title="Code" />
        </ColorSchemeSnapshot>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const before = canvasElement.querySelector('pre')?.textContent;

        await userEvent.click(canvas.getByLabelText('Diff'));
        await expect(canvas.getByLabelText('Diff')).toBeChecked();
        await expect(canvasElement.querySelector('pre')?.textContent).not.toBe(before);

        await userEvent.click(canvas.getByLabelText('Theme'));
        await expect(canvasElement.querySelector('pre')?.textContent).toBe(before);
    },
};

export const Modes: Story = {
    render: args => (
        <ColorSchemeSnapshot {...args}>
            <SnapshotModes title="Dunkel und Hell" />
        </ColorSchemeSnapshot>
    ),
};

export const Cvd: Story = {
    render: args => (
        <ColorSchemeSnapshot {...args}>
            <SnapshotCvd title="Farbfehlsichtigkeit" />
        </ColorSchemeSnapshot>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const visions = canvas.getAllByRole('radio');
        const checked = visions.find(v => (v as HTMLInputElement).checked);

        const other = visions.find(v => v !== checked)!;
        await userEvent.click(other);
        await expect(other).toBeChecked();
        await expect(checked).not.toBeChecked();
    },
};

export const Distinct: Story = {
    render: args => (
        <ColorSchemeSnapshot {...args}>
            <SnapshotDistinct title="Unterscheidbarkeit" />
        </ColorSchemeSnapshot>
    ),
};

export const Scales: Story = {
    render: args => (
        <ColorSchemeSnapshot {...args}>
            <SnapshotScales title="Die Skalen" />
        </ColorSchemeSnapshot>
    ),
};

export const Exceptions: Story = {
    render: args => (
        <ColorSchemeSnapshot {...args}>
            <SnapshotExceptions title="Bewusste Ausnahmen" />
        </ColorSchemeSnapshot>
    ),
};

/** No exceptions: the block shows nothing to justify. */
export const NoExceptions: Story = {
    args: {
        data: {
            ...data,
            modes: {
                dark: { ...data.modes.dark, exceptions: [] },
                light: { ...data.modes.light, exceptions: [] },
            },
        },
    },
    render: args => (
        <ColorSchemeSnapshot {...args}>
            <SnapshotExceptions title="Bewusste Ausnahmen" />
        </ColorSchemeSnapshot>
    ),
};

export const Editor: Story = {
    render: args => (
        <ColorSchemeSnapshot {...args}>
            <SnapshotEditor title="Im Editor" />
        </ColorSchemeSnapshot>
    ),
};
