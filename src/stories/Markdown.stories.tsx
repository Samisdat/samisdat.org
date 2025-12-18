import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {Markdown} from "@/components/Markdown";
import {serialize} from "@/components/Markdown/serialise";

const meta = {
  title: "Typo/Markdown",
  component: Markdown,
  tags: ["autodocs"],
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;


const serializedSource = await serialize(`
# Hei

💩

When CSS Grid layout was first released, it came with a big asterisk: only the grid’s _direct children_ could participate in the layout. “Subgrid” is a newer addition to CSS Grid which allows us to extend the grid layout down through the DOM tree.

When I first heard about subgrid, it seemed to me like a convenience, a way to make it a bit simpler to accomplish the same stuff I was already doing. **As it turns out, subgrid is _way_ more interesting than that.** It opens whole new doors in terms of the UIs we can build!

In this tutorial, I’ll show you some of the exciting new things we can do with subgrid. Along the way, you’ll learn the basic mechanics of subgrid. We’ll even go over the most common gotchas!

Lorem \`inline\` ipsum

\`\`\`javascript
<div class="grid">
  <header>
    <h1>…</h1>
    <p>…</p>
  </header>
  <img alt="…" src="/img/thumb-sneakers.jpg" />
  <img alt="…" src="/img/thumb-rocket.jpg" />
  <img alt="…" src="/img/thumb-fish.jpg" />
  <img alt="…" src="/img/thumb-guitar-pedals.jpg" />
  <img alt="…" src="/img/thumb-machine.jpg" />
  <img alt="…" src="/img/thumb-particles.jpg" />
</div>
\`\`\`

# Hei

`);

export const Test: Story = {
  args: {
    serializedSource
  },
};

