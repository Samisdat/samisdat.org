import type { Meta, StoryObj } from "@storybook/react";

import { DemoBox } from ".";

const meta = {
  title: "DemoBox",
  component: DemoBox,
  tags: ["autodocs"],
} satisfies Meta<typeof DemoBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Red: Story = {
  args: {
    color: "red",
    children: "Lorem Ipsum",
  },
};
export const Blue: Story = {
  args: {
    color: "blue",
    children: "Lorem Ipsum",
  },
};
export const Yellow: Story = {
  args: {
    color: "yellow",
    children: "Lorem Ipsum",
  },
};
