// This file has been automatically migrated to valid ESM format by Storybook.
import type { StorybookConfig } from '@storybook/nextjs-vite';
import wyw from '@wyw-in-js/vite';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: ['@chromatic-com/storybook', '@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
    framework: {
        name: '@storybook/nextjs-vite',
        options: {},
    },
    staticDirs: ['../../website/public'],
    async viteFinal(config) {
        // Resolve @/* alias to website/src
        config.resolve = config.resolve || {};
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.resolve(__dirname, '../../website/src'),
        };

        // Externalize next/image to avoid rolldown resolution issues
        config.build = config.build || {};
        config.build.rolldownOptions = config.build.rolldownOptions || {};
        config.build.rolldownOptions.external = [
            ...(config.build.rolldownOptions.external || []),
            'next/image',
        ];

        // Add WYW-in-JS (Linaria) plugin for Vite
        config.plugins = config.plugins || [];
        config.plugins.push(
            wyw({
                include: ['**/*.{ts,tsx,js,jsx}'],
                babelOptions: {
                    presets: ['@babel/preset-typescript', '@babel/preset-react'],
                },
            })
        );
        return config;
    },
};
export default config;
