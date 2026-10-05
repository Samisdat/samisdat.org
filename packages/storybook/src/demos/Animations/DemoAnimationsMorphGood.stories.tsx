import type { Meta, StoryObj } from "@storybook/react";
import { DemoAnimationsMorphGood } from "@samisdat/demos/Animations/DemoAnimationsMorphGood";

const meta = {
  title: "Demo/Animations/MorphGood",
  component: DemoAnimationsMorphGood,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DemoAnimationsMorphGood>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
