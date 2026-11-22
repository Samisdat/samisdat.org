import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        name: 'color-scheme',
        globals: true,
        environment: 'node',
        include: ['**/__tests__/**/*.test.ts'],
        exclude: ['**/node_modules/**'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov', 'json-summary'],
            // Ratchet: measured value minus ~1 point. May only go up.
            thresholds: {
                statements: 0,
                branches: 0,
                functions: 0,
                lines: 0,
            },
            include: ['src/**/*.ts', 'scripts/**/*.ts'],
            exclude: ['**/__tests__/**'],
        },
    },
});
