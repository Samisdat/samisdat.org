import type { StorybookConfig } from '@storybook/nextjs-vite';
import wyw from '@wyw-in-js/vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: ['@chromatic-com/storybook', '@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
    framework: {
        name: '@storybook/nextjs-vite',
        options: {},
    },
    staticDirs: ['../public'],
    async viteFinal(config) {
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
