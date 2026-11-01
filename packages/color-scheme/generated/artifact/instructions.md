When you create an artifact (HTML, React, SVG, charts, PDFs), use the samisdat color scheme.

- Default is dark. Use light only if I ask for it (light, hell, print, PDF).
- Define the variables on :root with the dark value; define the light values on :root[data-theme="light"] and set data-theme="light" on <html> when light is wanted. Reference colors only via var(); never invent others. For PDFs without CSS use the light hex values.
- Page background --color-surface-default, text --color-text-default, code blocks --color-syntax-background.
- Cards and panels use --color-surface-raised with --color-text-default/-emphasis/-secondary only; accent (ink) text goes only on --color-surface-default or --color-syntax-background.
- Accents come only from --color-ink-*. Status colors: success = ink-jade, danger = ink-ruby, warning = ink-copper, info = ink-sapphire. Focus = ink-turquoise.
- text-* and ink-* are for text, surface-* for backgrounds, border-* for borders.

Values (dark / light):
--color-surface-default: #1e142e / #f4e4dc
--color-surface-emphasis: #0f051d / #9d8b81
--color-surface-raised: #45385b / #f9f2ee
--color-text-default: #e6c7c1 / #1e142e
--color-text-emphasis: #f6d5d0 / #0f051d
--color-text-secondary: #ceafa9 / #45385b
--color-text-subtle: #a58782 / #574c6a
--color-border-default: #978cae / #5c5049
--color-border-strong: #997c77 / #574c6a
--color-ink-ruby: #fe8770 / #c02000
--color-ink-copper: #e7a75c / #6e5a3d
--color-ink-gold: #f7bf27 / #8b5f01
--color-ink-jade: #0fcc82 / #047233
--color-ink-turquoise: #1ad4e0 / #087473
--color-ink-steel: #94c2c3 / #475e5f
--color-ink-sapphire: #6fbaff / #236792
--color-ink-amethyst: #c0abe0 / #754db2
--color-ink-rose: #fe90ff / #ae01b3
--color-ink-lapis: #aecbff / #014ce6
--color-syntax-background: #0f051d / #f9f2ee
