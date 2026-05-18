import type { Meta, StoryObj } from '@storybook/react';

import { Placeholder } from '@/components/Placeholder';
import { Container as ContainerComponent } from '@/components/Container';

const meta = {
    title: 'Layout/Container',
    component: ContainerComponent,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof ContainerComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Container: Story = {
    args: {
        children: <Placeholder />,
    },
};
