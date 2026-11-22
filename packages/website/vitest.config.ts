import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        name: 'website',
        globals: true,
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov', 'json-summary'],
            // Ratchet: measured value minus ~1 point. May only go up.
            thresholds: {
                statements: 26,
                branches: 20,
                functions: 15,
                lines: 27,
            },
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                '**/*.test.{ts,tsx}',
                '**/*.stories.{ts,tsx}',
                '**/node_modules/**',
                '**/.storybook/**',
                '**/dist/**',
                '**/build/**',
                // Next route files (pages, layouts, route handlers); exercised by smoke tests, not unit tests.
                'src/app/**',
                // next/font declarations: static config consumed by the Next compiler.
                'src/lib/typography/fonts-*.ts',
                // Template file maps read from disk at import time; data only.
                'src/components/Sandbox/templates/**',
                'src/components/Sandbox/templates.ts',
            ],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
