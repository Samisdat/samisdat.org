import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { fn } from '@storybook/test';
import { useState } from 'react';

import { ThemeName, ThemeSwitcher } from './';

const meta = {
    title: 'Interaction/ThemeSwitcher',
    component: ThemeSwitcher,
    tags: ['autodocs'],
    parameters: {},
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper to demonstrate state management
const ThemeSwitcherWithState = () => {
    const [theme, setTheme] = useState<ThemeName>('light');
    return <ThemeSwitcher theme={theme} onUpdate={setTheme} />;
};

export const LightMode: Story = {
    args: {
        theme: 'light',
        onUpdate: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);

        // Find the checkbox
        const checkbox = canvas.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked(); // light = unchecked

        // Verify label text
        expect(canvas.getByText(/light mode eingeschaltet/i)).toBeInTheDocument();
    },
};

export const DarkMode: Story = {
    args: {
        theme: 'dark',
        onUpdate: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);

        // Find the checkbox
        const checkbox = canvas.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toBeChecked(); // dark = checked

        // Verify label text
        expect(canvas.getByText(/dark mode eingeschaltet/i)).toBeInTheDocument();
    },
};

export const ToggleTheme: Story = {
    args: {
        theme: 'light',
        onUpdate: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);

        // Find the checkbox
        const checkbox = canvas.getByRole('checkbox');

        // Initially light (unchecked)
        expect(checkbox).not.toBeChecked();

        // Click to toggle to dark
        await userEvent.click(checkbox);
        expect(args.onUpdate).toHaveBeenCalledWith('dark');
    },
};

export const ToggleFromDark: Story = {
    args: {
        theme: 'dark',
        onUpdate: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);

        // Find the checkbox
        const checkbox = canvas.getByRole('checkbox');

        // Initially dark (checked)
        expect(checkbox).toBeChecked();

        // Click to toggle to light
        await userEvent.click(checkbox);
        expect(args.onUpdate).toHaveBeenCalledWith('light');
    },
};

export const Interactive: StoryObj = {
    render: () => <ThemeSwitcherWithState />,
};
