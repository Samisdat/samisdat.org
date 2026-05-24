import type { Meta, StoryObj } from "@storybook/react";

import { ColorSwitcher as ColorSwitcherComponent } from "@samisdat/ui-components/ColorSwitcher";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Tools/ColorSwitcher",
  component: ColorSwitcherComponent,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof ColorSwitcherComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Switch: Story = {
  args: {},
};
