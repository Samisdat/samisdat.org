import type { Preview } from '@storybook/react';
import '../../website/src/components/globalStyle';

import { Playwrite_NO, Source_Code_Pro, Source_Sans_3, Source_Serif_4 } from 'next/font/google';

const sourceSerif = Source_Serif_4({
    subsets: ['latin'],
    variable: '--font-serif',
});

const sourceSans = Source_Sans_3({
    subsets: ['latin'],
    variable: '--font-sans',
});

const sourceCode = Source_Code_Pro({
    subsets: ['latin'],
    variable: '--font-code',
});

const playwrite = Playwrite_NO({
    variable: '--font-italic',
    subsets: ['latin'],
    weight: 'variable',
    display: 'swap',
});

const preview: Preview = {
    decorators: [
        Story => (
            <main
                className={`${sourceSerif.variable} ${sourceSans.variable} ${sourceCode.variable} ${playwrite.variable}`}
            >
                <Story />
            </main>
        ),
    ],

    parameters: {
        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: 'todo'
        }
    }
};

export default preview;
