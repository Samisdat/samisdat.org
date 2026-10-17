import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Segmented as SegmentedComponent } from "@samisdat/ui-components/Segmented";

const meta = {
  title: "Controls/Segmented",
  component: SegmentedComponent,
  tags: ["autodocs"],
  parameters: {},
} satisfies Meta<typeof SegmentedComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: "default", label: "default" },
  { value: "raised", label: "raised · highlight · selection" },
  { value: "code", label: "code" },
];

export const Segmented: Story = {
  args: {
    label: "Gemessen auf",
    value: "raised",
    options,
    onChange: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <SegmentedComponent {...args} value={value} onChange={setValue} />;
  },
};
