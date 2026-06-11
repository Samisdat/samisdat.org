import type { Meta, StoryObj } from "@storybook/react";

import { Typo as TypoComponent, variants } from "@samisdat/ui-components/Typo";

const meta = {
  title: "Typo/Typo",
  component: TypoComponent,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: variants,
      description: "Text variant style",
    },
  },
} satisfies Meta<typeof TypoComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const P: Story = {
  args: {
    variant: "p",
    children: "Lorem",
  },
};

export const Strong: Story = {
  args: {
    variant: "strong",
    children: "Lorem",
  },
};

export const Em: Story = {
  args: {
    variant: "em",
    children: "Lorem",
  },
};
