import type { Meta, StoryObj } from "@storybook/react";

import { DemoCanvas } from ".";

const meta = {
  title: "DemoCanvas",
  component: DemoCanvas,
  tags: ["autodocs"],
} satisfies Meta<typeof DemoCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rect: Story = {
  args: {
    children: "",
    style: { height: "100px" },
  },
};
