import type { Meta, StoryObj } from "@storybook/react";

import { Container as ContainerComponent } from "../Container";
import { DemoBox } from "../DemoBox";

const meta = {
  title: "Layout/Container",
  component: ContainerComponent,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ContainerComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Container: Story = {
  args: {
    children: <DemoBox>Lorem Ipsum</DemoBox>,
  },
};
