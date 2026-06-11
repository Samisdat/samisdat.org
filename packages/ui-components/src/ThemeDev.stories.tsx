import type { Meta, StoryObj } from "@storybook/react";

import { ThemeDev as ThemeDevComponent } from "@samisdat/ui-components/ThemeDev";
import { DemoBox } from "@samisdat/ui-components/DemoBox";

const meta = {
  title: "Layout/ThemeDev",
  component: ThemeDevComponent,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ThemeDev>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThemeDev: Story = {
  args: {
    children: <DemoBox>Lorem Ipsum</DemoBox>,
  },
};
