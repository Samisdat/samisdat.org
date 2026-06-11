import type { Meta, StoryObj } from "@storybook/react";

import { CodeBlock } from "@samisdat/ui-components/CodeBlock";

const meta = {
  title: "CodeBlock",
  component: CodeBlock,
  tags: ["autodocs"],
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ts: Story = {
  args: {
    code: `<svg>
    [...]
    <rect
        className={'car'}
        x={'20'}
        y={'36'}
    >
        <animate
            attributeName="x"
            from="-50"
            to="180"
            dur={'40s'}
            repeatCount="indefinite"
        />
    </rect>
    [...]
</svg>`,
    language: "tsx",
  },
};
