import { Lead } from '@samisdat/ui-components/Lead';
import { expect, within } from 'storybook/test';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Typo/Lead',
    component: Lead,
    tags: ['autodocs'],
} satisfies Meta<typeof Lead>;

export default meta;
type Story = StoryObj<typeof meta>;

// In MDX the Markdown inside the wrapper becomes its own paragraph(s).
export const Default: Story = {
    render: args => (
        <Lead {...args}>
            <p>A short lead of two or three lines that frames the post before the running text begins.</p>
        </Lead>
    ),
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText(/short lead/)).toBeVisible();
    },
};

/** Props are forwarded to the wrapper, e.g. to limit the measure. */
export const WithMeasure: Story = {
    render: args => (
        <Lead
            {...args}
            data-testid="lead"
            style={{ ['--measure' as string]: '24rem' }}
        >
            <p>A short lead of two or three lines that frames the post before the running text begins.</p>
            <p>A second paragraph keeps the same styling.</p>
        </Lead>
    ),
    play: async ({ canvasElement }) => {
        const lead = within(canvasElement).getByTestId('lead');
        await expect(lead.querySelectorAll('p')).toHaveLength(2);
        await expect(lead.getBoundingClientRect().width).toBeLessThanOrEqual(24 * 20 + 1);
    },
};
