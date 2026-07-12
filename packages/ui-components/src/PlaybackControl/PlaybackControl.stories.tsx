import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from '@storybook/test';
import { fn } from '@storybook/test';

import { PlaybackControl } from "./";

const meta = {
  title: "Interaction/PlaybackControl",
  component: PlaybackControl,
  tags: ["autodocs"],
  parameters: {},
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
  play: async ({ canvasElement, args }) => {
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
    notice: "⚠ Reduced motion aktiv — Autoplay deaktiviert.",
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
