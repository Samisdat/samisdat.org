import type { Meta, StoryObj } from "@storybook/react";
import { DemoSmilCrank } from "@samisdat/ui-components/Demo/Smil/Crank";
import { DemoSmilCrankFormula } from "@samisdat/ui-components/Demo/Smil/Crank";
import { DemoContext } from "@samisdat/ui-components/Demo/DemoContext";
import { Stack } from "@samisdat/ui-components/Stack";

const meta = {
  title: "Demo/Smil/Crank",
  component: DemoSmilCrank,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    () => (
      <DemoContext duration="40s">
        <Stack container directionSmall="column" directionMedium="row" sticky>
          <Stack>
            <DemoSmilCrank />
          </Stack>
          <Stack>
            <DemoSmilCrankFormula
              locale="de-DE"
              texts={{
                phaseComment: "Phase im Zyklus (t, dur in s)",
                angleComment: "Winkel in Grad",
                consoleComment: "In der Konsole nachmessen",
                hint: [
                  "Ändere die Geschwindigkeit in der Demo,",
                  "um den Effekt zu sehen",
                ],
                jump: [
                  "dur {before}s → {after}s bei t = {t}s",
                  "angle springt",
                  "von {angleBefore}° auf {angleAfter}°",
                  "Δ {delta}°",
                ],
                reset: ["Zurückgesetzt auf t = 0."],
                resetLimit: ["Zurückgesetzt auf t = 0.", "t erreichte {limit}s"],
              }}
            />
          </Stack>
        </Stack>
      </DemoContext>
    ),
  ],
} satisfies Meta<typeof DemoSmilCrank>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
