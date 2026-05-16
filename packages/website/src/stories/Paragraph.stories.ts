import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Paragraph as ParagraphComponent } from '@/components/Paragraph';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Typo/Paragraph',
    component: ParagraphComponent,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof ParagraphComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Paragraph: Story = {
    args: {
        children: 'Paragraph',
    },
};
