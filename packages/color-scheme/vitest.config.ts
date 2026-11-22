import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        name: 'color-scheme',
        globals: true,
        environment: 'node',
        // No tests yet; keeps the package measured so its denominator shows up in the combined figure.
        passWithNoTests: true,
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
            // Library code only. scripts/ and plugins/ are build and lint CLIs run through tsx/terrazzo.
            include: ['src/**/*.ts'],
            exclude: ['**/*.test.ts', '**/node_modules/**'],
        },
    },
});
