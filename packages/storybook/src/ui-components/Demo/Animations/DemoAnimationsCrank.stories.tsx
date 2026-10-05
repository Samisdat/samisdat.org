import type { Meta, StoryObj } from "@storybook/react";
import { DemoAnimationsCrank } from "@samisdat/ui-components/Demo/Animations/DemoAnimationsCrank";

const meta = {
  title: "Demo/Animations/Crank",
  component: DemoAnimationsCrank,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DemoAnimationsCrank>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
