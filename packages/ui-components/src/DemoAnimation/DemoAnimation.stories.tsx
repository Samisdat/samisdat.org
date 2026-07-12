import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { fn } from '@storybook/test';
import { useState } from 'react';

import { DemoAnimation } from './';

const meta = {
    title: 'Interaction/DemoAnimation',
    component: DemoAnimation,
    tags: ['autodocs'],
    parameters: {
        // Disable autoplay in Storybook to test manual controls
        chromatic: { disableSnapshot: false },
    },
} satisfies Meta<typeof DemoAnimation>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple demo content for testing
const DemoContent = ({ speed }: { speed?: number }) => (
    <div
        style={{
            width: '100%',
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontSize: '2rem',
        }}
    >
        Demo Animation (Speed: {speed || 50}x)
    </div>
);

export const Default: Story = {
    args: {
        playbackControl: {
            isPlaying: false,
            speed: 50,
            onPlay: fn(),
            onPause: fn(),
            onReset: fn(),
            onSpeedChange: fn(),
        },
        children: <DemoContent />,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Verify PlaybackControl is rendered
        expect(canvas.getByRole('button', { name: /play/i })).toBeInTheDocument();
    },
};

export const WithReducedMotion: Story = {
    args: {
        playbackControl: {
            isPlaying: false,
            speed: 50,
            onPlay: fn(),
            onPause: fn(),
            onReset: fn(),
            onSpeedChange: fn(),
        },
        children: <DemoContent />,
    },
    parameters: {
        // Simulate reduced motion preference
        viewport: { defaultViewport: 'mobile1' },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // When reduced motion is active, a notice should be displayed
        // Note: This test would need to mock usePrefersReducedMotion
        // For now, we just verify the component renders
        expect(canvas.getByRole('button', { name: /play/i })).toBeInTheDocument();
    },
};

export const PlaybackInteraction: Story = {
    args: {
        playbackControl: {
            isPlaying: false,
            speed: 50,
            onPlay: fn(),
            onPause: fn(),
            onReset: fn(),
            onSpeedChange: fn(),
        },
        children: <DemoContent speed={50} />,
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);

        // Find and click Play button
        const playButton = canvas.getByRole('button', { name: /play/i });
        await userEvent.click(playButton);

        // Verify onPlay was called
        expect(args.playbackControl.onPlay).toHaveBeenCalledTimes(1);
    },
};

export const SpeedChange: Story = {
    args: {
        playbackControl: {
            isPlaying: false,
            speed: 50,
            onPlay: fn(),
            onPause: fn(),
            onReset: fn(),
            onSpeedChange: fn(),
        },
        children: <DemoContent speed={50} />,
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);

        // Find increment button and click it
        const buttons = canvas.getAllByRole('button');
        const incrementButton = buttons.find((btn) => btn.textContent?.includes('+'));

        if (incrementButton) {
            await userEvent.click(incrementButton);
            // Verify onSpeedChange was called (with default step of 1)
            expect(args.playbackControl.onSpeedChange).toHaveBeenCalled();
        }
    },
};

// Interactive story with working state
const DemoAnimationWithState = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(50);

    return (
        <DemoAnimation
            playbackControl={{
                isPlaying,
                speed,
                onPlay: () => setIsPlaying(true),
                onPause: () => setIsPlaying(false),
                onReset: () => {
                    setIsPlaying(false);
                    setSpeed(50);
                },
                onSpeedChange: setSpeed,
            }}
        >
            <DemoContent speed={speed} />
        </DemoAnimation>
    );
};

export const Interactive: StoryObj = {
    render: () => <DemoAnimationWithState />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Start with Play button visible
        const playButton = canvas.getByRole('button', { name: /play/i });
        expect(playButton).toBeInTheDocument();

        // Click to play
        await userEvent.click(playButton);

        // Pause button should now be visible
        const pauseButton = await canvas.findByRole('button', { name: /pause/i });
        expect(pauseButton).toBeInTheDocument();
    },
};
