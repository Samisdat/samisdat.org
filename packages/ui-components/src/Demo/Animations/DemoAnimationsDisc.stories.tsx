import type { Meta, StoryObj } from "@storybook/react";
import { DemoAnimationsDisc } from "./DemoAnimationsDisc";

const meta = {
  title: "Demo/Animations/Disc",
  component: DemoAnimationsDisc,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DemoAnimationsDisc>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
