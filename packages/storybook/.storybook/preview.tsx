import type { Preview } from '@storybook/react';
import '@samisdat/ui-components/globalStyle';

import '@fontsource-variable/source-serif-4';
import '@fontsource-variable/source-sans-3';
import '@fontsource-variable/source-code-pro';
import '@fontsource/playwrite-no';

const preview: Preview = {
    decorators: [
        Story => (
            <main
                style={{
                    '--font-serif': "'Source Serif 4 Variable', serif",
                    '--font-sans': "'Source Sans 3 Variable', sans-serif",
                    '--font-code': "'Source Code Pro Variable', monospace",
                    '--font-italic': "'Playwrite NO', cursive",
                } as React.CSSProperties}
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
