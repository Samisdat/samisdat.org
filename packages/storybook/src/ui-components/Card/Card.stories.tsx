import type { Meta, StoryObj } from "@storybook/react";

import { Card as CardComponent } from "@samisdat/ui-components/Card";
import { Typo } from "@samisdat/ui-components/Typo";

const meta = {
  title: "Layout/Card",
  component: CardComponent,
  tags: ["autodocs"],
  parameters: {},
} satisfies Meta<typeof CardComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {
  args: {
    children: (
      <>
        <Typo>Lorem Ipsum</Typo>
        <Typo>Lorem Ipsum</Typo>
        <Typo>Lorem Ipsum</Typo>
      </>
    ),
  },
};
