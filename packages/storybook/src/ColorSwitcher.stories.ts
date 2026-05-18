import type { Meta, StoryObj } from "@storybook/react";

import { ColorSwitcher } from "@samsidat/ui-components/ColorSwitcher";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Tools/ColorSwitcher",
  component: ColorSwitcher,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof ColorSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Switch: Story = {
  args: {},
};
