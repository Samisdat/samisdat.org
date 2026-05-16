// eslint.config.js
import js from '@eslint/js';
import next from '@next/eslint-plugin-next';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

export default [
    js.configs.recommended,
    prettierConfig,

    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
        },
        plugins: {
            '@typescript-eslint': tseslint,
            '@next/next': next,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            ...next.configs.recommended.rules,
            ...next.configs['core-web-vitals'].rules,

            // IMPORTANT: TS kennt undef besser als ESLint
            'no-undef': 'off',
        },
    },

    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
        },
        plugins: { '@next/next': next },
        rules: {
            ...next.configs.recommended.rules,
            ...next.configs['core-web-vitals'].rules,
        },
    },

    {
        ignores: [
            '.next/**',
            'node_modules/**',
            'dist/**',
            'out/**',
            '.git/**',
            '*.min.js',
            '*.config.js',
            '*.config.ts',
        ],
    },
];
