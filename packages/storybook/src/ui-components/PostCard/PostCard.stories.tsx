import type { Meta, StoryObj } from "@storybook/react";

import { PostCard } from "../../../../website/src/components/PostCard";

const base = {
  slug: "parallax",
  source: "",
  frontmatter: {
    title: "Parallax",
    description:
      "Mausbewegung wird in normalisierte Koordinaten umgerechnet und treibt einen Parallax-Effekt mit mehreren Ebenen – interaktiv im Browser.",
    date: new Date("2026-01-19"),
    published: true,
    image: true as const,
  },
};

const meta = {
  title: "Blog/PostCard",
  component: PostCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: { post: base },
};

export const WithoutImage: Story = {
  args: {
    post: {
      ...base,
      frontmatter: { ...base.frontmatter, image: undefined },
    },
  },
};

export const WithoutDescription: Story = {
  args: {
    post: {
      ...base,
      frontmatter: { ...base.frontmatter, description: undefined },
    },
  },
};
