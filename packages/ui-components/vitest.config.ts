import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        name: 'ui-components',
        environment: 'happy-dom',
        include: ['src/**/*.test.{ts,tsx}'],
    },
});
