import type { Meta, StoryObj } from "@storybook/react";

import { BlogCollectorCard as BlogCollectorCardComponent } from "@samisdat/ui-components/BlogCollectorCard";

const meta = {
  title: "Blog/BlogCollectorCard",
  component: BlogCollectorCardComponent,
  tags: ["autodocs"],
  parameters: {},
} satisfies Meta<typeof BlogCollectorCardComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BlogCollectorCard: Story = {
  args: {},
};
