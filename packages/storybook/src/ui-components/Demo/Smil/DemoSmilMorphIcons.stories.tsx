import type { Meta, StoryObj } from "@storybook/react";
import { DemoSmilMorphIcons } from "@samisdat/ui-components/Demo/Smil/MorphIcons";

const meta = {
  title: "Demo/Smil/MorphIcons",
  component: DemoSmilMorphIcons,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DemoSmilMorphIcons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
