import type { Meta, StoryObj } from "@storybook/react";

import { Heading } from "../Heading";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Typo/Heading",
  component: Heading,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Level1: Story = {
  args: {
    children: "Heading",
    level: 1,
  },
};
export const Level2: Story = {
  args: {
    children: "Heading",
    level: 2,
  },
};
export const Level3: Story = {
  args: {
    children: "Heading",
    level: 3,
  },
};
export const Level4: Story = {
  args: {
    children: "Heading",
    level: 4,
  },
};
export const Level5: Story = {
  args: {
    children: "Heading",
    level: 5,
  },
};
export const Level6: Story = {
  args: {
    children: "Heading",
    level: 6,
  },
};
