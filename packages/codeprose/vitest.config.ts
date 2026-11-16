import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        name: 'codeprose',
        globals: true,
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov', 'json-summary'],
            // Ratchet: measured value minus ~1 point. May only go up.
            thresholds: {
                statements: 42,
                branches: 43,
                functions: 34,
                lines: 43,
            },
            include: ['src/**/*.{ts,tsx}'],
            exclude: ['**/*.test.{ts,tsx}', '**/*.stories.{ts,tsx}', '**/dist/**'],
        },
    },
});
