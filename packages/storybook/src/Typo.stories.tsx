import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Typo as TypoComponent } from '@/components/Typo';

const meta = {
    title: 'Typo/Typo',
    component: TypoComponent,
    tags: ['autodocs'],
} satisfies Meta<typeof TypoComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Em: Story = {
    args: {
        variant: 'em',
        children: 'Lorem',
    },
};
