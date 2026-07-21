import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        name: 'website',
        globals: true,
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                '**/*.test.{ts,tsx}',
                '**/*.stories.{ts,tsx}',
                '**/node_modules/**',
                '**/.storybook/**',
                '**/dist/**',
                '**/build/**',
            ],
            thresholds: {
                statements: 19,
                branches: 23,
                functions: 15,
                lines: 20,
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
