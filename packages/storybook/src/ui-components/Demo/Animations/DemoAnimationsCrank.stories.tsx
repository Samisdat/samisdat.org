import type { Meta, StoryObj } from "@storybook/react";
import { DemoAnimationsCrank } from "@samisdat/ui-components/Demo/Animations/DemoAnimationsCrank";
import { DemoAnimationsCrankFormula } from "@samisdat/ui-components/Demo/Animations/DemoAnimationsCrankFormula";
import { DemoContext } from "@samisdat/ui-components/Demo/DemoContext";
import { Stack } from "@samisdat/ui-components/Stack";

const meta = {
  title: "Demo/Animations/Crank",
  component: DemoAnimationsCrank,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    () => (
      <DemoContext duration="40s">
        <Stack container directionSmall="column" directionMedium="row" sticky>
          <Stack>
            <DemoAnimationsCrank />
          </Stack>
          <Stack>
            <DemoAnimationsCrankFormula />
          </Stack>
        </Stack>
      </DemoContext>
    ),
  ],
} satisfies Meta<typeof DemoAnimationsCrank>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
