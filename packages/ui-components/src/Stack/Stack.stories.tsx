import type { Meta, StoryObj } from "@storybook/react";

import { Stack } from ".";
import { DemoBox } from "../DemoBox";
import { space } from "../tokens/space";

const meta = {
  title: "Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnTop: Story = {
  args: {
    container: true,
    directionSmall: "column",
    children: (
      <>
        <Stack>
          <DemoBox>Top</DemoBox>
        </Stack>
        <Stack>
          <DemoBox color="yellow">Bottom</DemoBox>
        </Stack>
      </>
    ),
  },
};

export const SideBySide: Story = {
  args: {
    container: true,
    directionSmall: "row",
    children: (
      <>
        <Stack>
          <DemoBox>Left</DemoBox>
        </Stack>
        <Stack>
          <DemoBox color="yellow">Right</DemoBox>
        </Stack>
      </>
    ),
  },
};

export const Gap: Story = {
  args: {
    container: true,
    directionSmall: "row",
    gap: space[2],
    children: (
      <>
        <Stack>
          <DemoBox>Left</DemoBox>
        </Stack>
        <Stack>
          <DemoBox color="yellow">Right</DemoBox>
        </Stack>
      </>
    ),
  },
};

// Stacks on small viewports, switches to a row at the `medium` breakpoint.
export const Responsive: Story = {
  args: {
    container: true,
    directionSmall: "column",
    directionMedium: "row",
    children: (
      <>
        <Stack>
          <DemoBox>Column on mobile</DemoBox>
        </Stack>
        <Stack>
          <DemoBox color="yellow">Row from 768px</DemoBox>
        </Stack>
      </>
    ),
  },
};

// Visual order is reversed via `orderSmall` without changing DOM order.
export const Reordered: Story = {
  args: {
    container: true,
    directionSmall: "row",
    children: (
      <>
        <Stack orderSmall={2}>
          <DemoBox>First in DOM, shown second</DemoBox>
        </Stack>
        <Stack orderSmall={1}>
          <DemoBox color="yellow">Second in DOM, shown first</DemoBox>
        </Stack>
      </>
    ),
  },
};

// `grow` / `basis` give items different weights instead of forcing equal sizes.
export const Weighted: Story = {
  args: {
    container: true,
    directionSmall: "row",
    children: (
      <>
        <Stack grow={2}>
          <DemoBox>grow 2</DemoBox>
        </Stack>
        <Stack grow={1}>
          <DemoBox color="yellow">grow 1</DemoBox>
        </Stack>
        <Stack grow={0} basis="120px">
          <DemoBox color="green">fixed 120px</DemoBox>
        </Stack>
      </>
    ),
  },
};
