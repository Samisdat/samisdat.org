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
            reporter: ['text', 'lcov'],
            include: ['src/**/*.ts', 'scripts/**/*.ts'],
            exclude: ['**/__tests__/**'],
        },
    },
});
