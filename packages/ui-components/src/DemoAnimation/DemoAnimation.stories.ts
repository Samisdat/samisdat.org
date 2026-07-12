import type { Meta, StoryObj } from "@storybook/react";

import { DemoAnimation } from ".";

const meta = {
  title: "DemoAnimation",
  component: DemoAnimation,
  tags: ["autodocs"],
} satisfies Meta<typeof DemoAnimation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rect: Story = {
  args: {
    children: "",
    style: { height: "100px" },
    playbackControl: {
      isPlaying: false,
      speed: 50,
      onPlay: () => {},
      onPause: () => {},
      onReset: () => {},
      onSpeedChange: () => {},
    },
  },
};
