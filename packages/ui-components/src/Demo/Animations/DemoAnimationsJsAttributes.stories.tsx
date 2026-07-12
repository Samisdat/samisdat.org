import type { Meta, StoryObj } from '@storybook/react';
import { DemoAnimationsJsAttributes } from './DemoAnimationsJsAttributes';

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
