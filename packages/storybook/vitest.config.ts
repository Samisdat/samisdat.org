import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
    test: {
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov', 'json-summary'],
            // Ratchet: measured value minus ~1 point. May only go up.
            thresholds: {
                statements: 62,
                branches: 42,
                functions: 54,
                lines: 61,
            },
            include: ['../ui-components/src/**/*.{ts,tsx}'],
            exclude: [
                '**/*.stories.{ts,tsx}',
                // Test doubles, not shipped code.
                '**/__mocks__/**',
                // Design token constants; data only.
                '../ui-components/src/tokens/**',
            ],
            allowExternal: true,
        },
        projects: [
            {
                extends: true,
                plugins: [
                    // The plugin will run tests for the stories defined in your Storybook config
                    // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
                    storybookTest({ configDir: path.join(dirname, '.storybook') }),
                ],
                test: {
                    name: 'storybook',
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright({}),
                        instances: [{ browser: 'chromium' }],
                    },
                    setupFiles: ['.storybook/vitest.setup.ts'],
                },
            },
        ],
    },
});
