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
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                // Browser globals
                console: 'readonly',
                document: 'readonly',
                window: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                requestAnimationFrame: 'readonly',
                cancelAnimationFrame: 'readonly',
                performance: 'readonly',
                HTMLInputElement: 'readonly',
                SVGPathElement: 'readonly',
                // React
                React: 'readonly',
                JSX: 'readonly',
                // Node globals
                process: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                Buffer: 'readonly',
                global: 'readonly',
            },
        },
        plugins: {
            '@next/next': next,
            '@typescript-eslint': tseslint,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
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
