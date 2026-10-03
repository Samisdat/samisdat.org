import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        name: 'scholion',
        globals: true,
        environment: 'node',
    },
})
