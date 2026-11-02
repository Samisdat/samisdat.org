import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        name: 'codeprose',
        globals: true,
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            include: ['src/**/*.{ts,tsx}'],
            exclude: ['**/*.test.{ts,tsx}', '**/*.stories.{ts,tsx}', '**/dist/**'],
        },
    },
});
