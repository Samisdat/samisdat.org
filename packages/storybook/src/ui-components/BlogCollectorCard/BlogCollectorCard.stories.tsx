import { BlogCollectorCard as BlogCollectorCardComponent } from '@samisdat/ui-components/BlogCollectorCard';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Blog/BlogCollectorCard',
    component: BlogCollectorCardComponent,
    tags: ['autodocs'],
    parameters: {},
} satisfies Meta<typeof BlogCollectorCardComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BlogCollectorCard: Story = {
    args: {
        name: 'Josh Comeau',
        domain: 'joshwcomeau.com',
        no: '01',
        total: 27,
        shot: '/posts/blogs/josh-comeau.jpg',
        shotLight: '/posts/blogs/josh-comeau-light.jpg',
        hue: 'var(--color-ink-rose)',
        themen: ['CSS', 'React', 'Interaktives'],
        facts: [
            ['Sprache', 'Englisch'],
            ['Nationalität', 'Kanada'],
            ['Rolle', 'Entwickler, Lehrer'],
            ['Wohnort', 'Montréal'],
            ['Format', 'Text, interaktiv'],
            ['Gebaut mit', 'Next.js'],
        ],
    },
};
