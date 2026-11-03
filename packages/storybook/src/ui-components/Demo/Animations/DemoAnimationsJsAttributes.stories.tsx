import { DemoAnimationsJsAttributes } from '@samisdat/ui-components/Demo/Animations/DemoAnimationsJsAttributes';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Demo/Animations/JsAttributes',
    component: DemoAnimationsJsAttributes,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DemoAnimationsJsAttributes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
