import type { Meta, StoryObj } from "@storybook/react";
import { DemoAnimationsMorphHills } from "@samisdat/demos/Animations/DemoAnimationsMorphHills";

const meta = {
  title: "Demo/Animations/MorphHills",
  component: DemoAnimationsMorphHills,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DemoAnimationsMorphHills>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
