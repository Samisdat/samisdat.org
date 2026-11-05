/** Theme variants and report columns shared by the comparison report and the post snapshot. */
import { readFileSync } from 'node:fs';

import type { Mode } from '../../src/contrast';
import type { Variant } from './measure';
import type { Column } from './report';

const ours = (mode: Mode): Variant => {
    const file = new URL(`../../generated/shiki/${mode}.json`, import.meta.url);
    const theme = JSON.parse(readFileSync(file, 'utf8'));
    return { family: 'samisdat', mode, theme: { ...theme, name: `samisdat-${mode}` } };
};

const builtin: [string, Mode, string][] = [
    ['Solarized', 'dark', 'solarized-dark'],
    ['Solarized', 'light', 'solarized-light'],
    ['Gruvbox', 'dark', 'gruvbox-dark-medium'],
    ['Gruvbox', 'light', 'gruvbox-light-medium'],
    ['Dracula', 'dark', 'dracula'],
    ['Nord', 'dark', 'nord'],
    ['Catppuccin', 'dark', 'catppuccin-mocha'],
    ['Catppuccin', 'light', 'catppuccin-latte'],
    ['Tokyo Night', 'dark', 'tokyo-night'],
    ['One', 'dark', 'one-dark-pro'],
    ['One', 'light', 'one-light'],
    ['Monokai', 'dark', 'monokai'],
    ['Rosé Pine', 'dark', 'rose-pine'],
    ['Rosé Pine', 'light', 'rose-pine-dawn'],
    ['Kanagawa', 'dark', 'kanagawa-wave'],
    ['Kanagawa', 'light', 'kanagawa-lotus'],
    ['Everforest', 'dark', 'everforest-dark'],
    ['Everforest', 'light', 'everforest-light'],
];

export const variants: Variant[] = [
    ours('dark'),
    ours('light'),
    ...builtin.map(([family, mode, theme]): Variant => ({ family, mode, theme })),
];

/**
 * Which direction is "better" is a judgement call, see the README: contrast
 * and distances are better when higher, lightness spread and the dark/light
 * deviation when lower.
 */
export const columns: Column[] = [
    {
        id: 'wcag45',
        label: 'WCAG ≥ 4.5',
        hint: 'Share of characters',
        higherIsBetter: true,
        get: m => m.wcag.share45,
        format: pct,
    },
    {
        id: 'wcagMin',
        label: 'WCAG min',
        hint: 'Weakest used color',
        higherIsBetter: true,
        get: m => m.wcag.min,
        format: fixed(2),
    },
    {
        id: 'deAccent',
        label: 'ΔE OK accents',
        hint: 'Closest pair of accent colors',
        higherIsBetter: true,
        get: m => m.accentDistance.min,
        format: fixed(3),
    },
    {
        id: 'protan',
        label: 'Protan',
        hint: 'Closest accent pair, simulated',
        higherIsBetter: true,
        get: m => m.cvd.protan.min,
        format: fixed(3),
    },
    {
        id: 'deutan',
        label: 'Deutan',
        hint: 'Closest accent pair, simulated',
        higherIsBetter: true,
        get: m => m.cvd.deutan.min,
        format: fixed(3),
    },
    {
        id: 'tritan',
        label: 'Tritan',
        hint: 'Closest accent pair, simulated',
        higherIsBetter: true,
        get: m => m.cvd.tritan.min,
        format: fixed(3),
    },
    {
        id: 'lightnessSd',
        label: 'L spread',
        hint: 'SD of accent lightness, lower is more even',
        higherIsBetter: false,
        get: m => m.lightness.sd,
        format: fixed(3),
    },
    {
        id: 'rho',
        label: 'ρ dark/light',
        hint: 'Rank correlation of role readability',
        higherIsBetter: true,
        get: m => m.correspondence?.spearman,
        format: fixed(2),
    },
    {
        id: 'dWcag',
        label: 'ΔWCAG dark/light',
        hint: 'Mean |ratio| difference per role',
        higherIsBetter: false,
        get: m => m.correspondence?.meanAbsDiffWcag,
        format: fixed(1),
    },
];

export function fixed(digits: number) {
    return (value: number) => value.toFixed(digits);
}
export function pct(value: number) {
    return `${Math.round(value * 100)} %`;
}
