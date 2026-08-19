import type { Meta, StoryObj } from "@storybook/react";
import { DemoAnimationsMorphBad } from "./DemoAnimationsMorphBad";

const meta = {
  title: "Demo/Animations/MorphBad",
  component: DemoAnimationsMorphBad,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DemoAnimationsMorphBad>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
