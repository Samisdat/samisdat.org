import type { Meta, StoryObj } from "@storybook/react";

import { PlaybackControl } from "./";

const meta = {
  title: "Interaction/PlaybackControl",
  component: PlaybackControl,
  tags: ["autodocs"],
  parameters: {},
} satisfies Meta<typeof PlaybackControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {
  args: {
    speed: 50,
  },
};
