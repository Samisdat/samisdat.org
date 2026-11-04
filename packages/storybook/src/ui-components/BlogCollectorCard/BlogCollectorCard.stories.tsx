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
  args: {
    name: "Josh Comeau",
    domain: "joshwcomeau.com",
    no: "01",
    total: 27,
    shot: "/posts/blogs/josh-comeau.jpg",
    hue: "var(--color-ink-rose)",
    themen: ["CSS", "React", "Interaktives"],
    sprache: "Englisch",
    nat: "Kanada ?",
    rolle: "Entwickler, Lehrer",
    wohnort: "Montréal ?",
    format: "Text, interaktiv",
    stack: "Next.js ?",
  },
};
