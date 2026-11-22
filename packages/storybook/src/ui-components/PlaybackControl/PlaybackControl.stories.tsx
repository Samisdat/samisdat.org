import { PlaybackControl } from '@samisdat/ui-components/PlaybackControl';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { fn } from 'storybook/test';

import { viewportModes } from '../../../.storybook/chromaticModes';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Interaction/PlaybackControl',
    component: PlaybackControl,
    tags: ['autodocs'],
    parameters: {
        chromatic: { modes: viewportModes },
    },
} satisfies Meta<typeof PlaybackControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        isPlaying: false,
        speed: 50,
        onPlay: fn(),
        onPause: fn(),
        onReset: fn(),
        onSpeedChange: fn(),
    },
};

export const PlayPauseToggle: Story = {
    args: {
        isPlaying: false,
        speed: 50,
        onPlay: fn(),
        onPause: fn(),
        onReset: fn(),
        onSpeedChange: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);

        // Initially should show Play button
        const playButton = canvas.getByRole('button', { name: /play/i });
        expect(playButton).toBeInTheDocument();

        // Click Play button
        await userEvent.click(playButton);
        expect(args.onPlay).toHaveBeenCalledTimes(1);
    },
};

export const Playing: Story = {
    args: {
        isPlaying: true,
        speed: 50,
        onPlay: fn(),
        onPause: fn(),
        onReset: fn(),
        onSpeedChange: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);

        // When playing, should show Pause button
        const pauseButton = canvas.getByRole('button', { name: /pause/i });
        expect(pauseButton).toBeInTheDocument();

        // Click Pause button
        await userEvent.click(pauseButton);
        expect(args.onPause).toHaveBeenCalledTimes(1);
    },
};

export const ResetButton: Story = {
    args: {
        isPlaying: false,
        speed: 75,
        onPlay: fn(),
        onPause: fn(),
        onReset: fn(),
        onSpeedChange: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);

        // Click Reset button
        const resetButton = canvas.getByRole('button', { name: /reset/i });
        await userEvent.click(resetButton);
        expect(args.onReset).toHaveBeenCalledTimes(1);
    },
};

export const SpeedControl: Story = {
    args: {
        isPlaying: false,
        speed: 50,
        speedMin: 1,
        speedMax: 100,
        speedStep: 5,
        onPlay: fn(),
        onPause: fn(),
        onReset: fn(),
        onSpeedChange: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);

        // Find increment and decrement buttons
        const buttons = canvas.getAllByRole('button');
        const decrementButton = buttons.find(btn => btn.textContent?.includes('-'));
        const incrementButton = buttons.find(btn => btn.textContent?.includes('+'));

        expect(decrementButton).toBeInTheDocument();
        expect(incrementButton).toBeInTheDocument();

        // Click increment button
        if (incrementButton) {
            await userEvent.click(incrementButton);
            expect(args.onSpeedChange).toHaveBeenCalledWith(55); // 50 + 5
        }

        // Click decrement button
        if (decrementButton) {
            await userEvent.click(decrementButton);
            expect(args.onSpeedChange).toHaveBeenCalledWith(45); // 50 - 5
        }
    },
};

export const SpeedSlider: Story = {
    args: {
        isPlaying: false,
        speed: 50,
        speedMin: 1,
        speedMax: 100,
        onPlay: fn(),
        onPause: fn(),
        onReset: fn(),
        onSpeedChange: fn(),
    },
    play: async ({ canvasElement, args: _args }) => {
        const canvas = within(canvasElement);

        // Find the speed slider
        const slider = canvas.getByRole('slider', { name: /speed/i });
        expect(slider).toBeInTheDocument();
        expect(slider).toHaveValue('50');
    },
};

export const WithNotice: Story = {
    args: {
        isPlaying: false,
        speed: 50,
        notice: '⚠ Reduced motion aktiv — Autoplay deaktiviert.',
        onPlay: fn(),
        onPause: fn(),
        onReset: fn(),
        onSpeedChange: fn(),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Verify notice is displayed
        const notice = canvas.getByText(/reduced motion aktiv/i);
        expect(notice).toBeInTheDocument();
    },
};

const DeviceSketch = () => (
    <svg
        viewBox="0 0 88 52"
        width="112"
        height="66"
    >
        <rect
            x="31"
            y="2"
            width="26"
            height="48"
            rx="4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="1.8 1.2"
        />
        <circle
            cx="44"
            cy="26"
            r="2.4"
            fill="currentColor"
        />
    </svg>
);

const marks = [
    { at: 0.6, label: 'Tap' },
    { from: 1.7, to: 3.0, label: 'Pan' },
    { from: 3.6, to: 4.6, label: 'Tilt' },
];

export const WithDeviceAndTimeline: Story = {
    args: {
        isPlaying: true,
        speed: 1,
        speedControl: false,
        notice: 'You are in control. The recording resumes after 3.5 s of rest.',
        onPlay: fn(),
        onPause: fn(),
        onReset: fn(),
        onSpeedChange: fn(),
    },
    render: (args) => {
        const [position, setPosition] = useState(3.42);

        return (
            <PlaybackControl
                {...args}
                device={<DeviceSketch />}
                timeline={{ position, duration: 6.4, marks, onSeek: setPosition }}
            />
        );
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const slider = canvas.getByRole('slider', { name: 'Position in der Aufzeichnung' });

        expect(slider).toHaveAttribute('aria-valuetext', '00:03.42');
        expect(canvas.queryByRole('slider', { name: /speed/i })).toBeNull();
    },
};
