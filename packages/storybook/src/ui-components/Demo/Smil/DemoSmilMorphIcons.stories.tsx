import type { Meta, StoryObj } from "@storybook/react";
import { DemoSmilMorphHeart } from "@samisdat/ui-components/Demo/Smil/MorphHeart";

const meta = {
  title: "Demo/Smil/MorphHeart",
  component: DemoSmilMorphHeart,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DemoSmilMorphHeart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
