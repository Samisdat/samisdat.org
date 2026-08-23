import type { Meta, StoryObj } from "@storybook/react";
import { DemoAnimationsMorphHeart } from "./DemoAnimationsMorphHeart";

const meta = {
  title: "Demo/Animations/MorphHeart",
  component: DemoAnimationsMorphHeart,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DemoAnimationsMorphHeart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
