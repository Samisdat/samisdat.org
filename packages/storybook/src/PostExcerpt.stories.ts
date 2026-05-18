import type { Meta, StoryObj } from '@storybook/react';

import { PostExcerpt } from '@/components/PostExcerpt';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Blog/PostExcerpt',
    component: PostExcerpt,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof PostExcerpt>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Excerpt: Story = {
    args: {
        children: 'Heading',
    },
};
