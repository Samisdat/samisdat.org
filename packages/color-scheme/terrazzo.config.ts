import { defineConfig } from '@terrazzo/cli';
import js from '@terrazzo/plugin-js';

import artifactCss from './plugins/plugin-artifact-css';
import claudeCode from './plugins/plugin-claude-code';
import ghostty from './plugins/plugin-ghostty';
import herdr from './plugins/plugin-herdr';
import nvim from './plugins/plugin-nvim';
import pi from './plugins/plugin-pi';
import shiki from './plugins/plugin-shiki';
import tsModule from './plugins/plugin-ts-module';

export default defineConfig({
    tokens: ['./tokens/theme.resolver.json'],
    outDir: './generated/',
    // Keep source order (hue by hue) in the generated modules.
    alphabetize: false,
    plugins: [
        js({ filename: 'tokens.js' }),
        tsModule(),
        shiki(),
        nvim(),
        herdr(),
        ghostty(),
        pi(),
        claudeCode(),
        artifactCss(),
    ],
    lint: {
        rules: {
            'core/valid-color': 'error',
            'core/colorspace': ['error', { colorSpace: 'oklch' }],
            'core/max-gamut': ['error', { gamut: 'srgb' }],
        },
    },
});
