/**
 * Wraps rules so they only apply in the light theme: `data-theme="light"` or, without an explicit
 * theme, the system preference (same pair of selectors as PlaybackControl). Use inside a template as
 * `${light('color: red;')}`; `&` refers to the element the template belongs to.
 */
export const light = (rules: string) => `
    [data-theme='light'] & {
        ${rules}
    }

    @media (prefers-color-scheme: light) {
        :root:not([data-theme]) & {
            ${rules}
        }
    }
`;

/**
 * Light palette local to the card. The card is a physical object (silver metal, light plate), so in the
 * light theme it uses these fixed values instead of the page tokens, whose mid-tone `surface-emphasis`
 * would turn the silver brown. Dark keeps using the page tokens.
 */
export const lightPalette = `
    --color-surface-default: #f3ede4;
    --color-surface-emphasis: #fffcf7;
    --color-surface-raised: #e5ddd3;
    --color-surface-subtle: #d5cbc5;
    --color-surface-muted: #b3a8b3;
    --color-text-default: #2b2039;
    --color-text-emphasis: #1e142e;
    --color-text-secondary: #4b3f5c;
    --color-text-subtle: #6f6379;
    --color-border-muted: #b3a8b3;
    --color-border-default: #8c8199;
    --color-ink-rose: #b81c97;
    --color-ink-turquoise: #007f89;
    --color-ink-gold: #946600;
    --color-ink-amethyst: #6a4c9c;
`;
