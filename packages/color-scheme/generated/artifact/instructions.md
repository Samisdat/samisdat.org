When you create an artifact (HTML, React, SVG, charts, PDFs), use the samisdat color scheme.
- Default is dark. Use light only if I ask for it (light, hell, print, PDF).
- Define the variables on :root with the dark value; define the light values on :root[data-theme="light"] and set data-theme="light" on <html> when light is wanted. Reference colors only via var(); never invent others. For PDFs without CSS use the light hex values.
- Page background --color-surface-default, text --color-text-default, code blocks --color-syntax-background.
- Cards and panels use --color-surface-raised with --color-text-default/-emphasis/-secondary only; accent (ink) text goes only on --color-surface-default or --color-syntax-background.
- Accents come only from --color-ink-*. Status colors: success = ink-green, danger = ink-red, warning = ink-orange, info = ink-blue. Focus = ink-teal.
- text-* and ink-* are for text, surface-* for backgrounds, border-* for borders.

Values (dark / light):
--color-surface-default: #1e142e / #e6c7c1
--color-surface-emphasis: #0f051d / #997c77
--color-surface-raised: #45385b / #f6d5d0
--color-text-default: #e6c7c1 / #1e142e
--color-text-emphasis: #f6d5d0 / #0f051d
--color-text-secondary: #ceafa9 / #45385b
--color-text-subtle: #a58782 / #574c6a
--color-border-default: #978cae / #6a4f4b
--color-border-strong: #997c77 / #574c6a
--color-ink-red: #ff5352 / #8c1134
--color-ink-orange: #e7a75c / #723600
--color-ink-yellow: #f7bf27 / #492f00
--color-ink-green: #0fcc82 / #274c1f
--color-ink-teal: #1ad4e0 / #2d5054
--color-ink-cyan: #94c2c3 / #033c41
--color-ink-blue: #6fbaff / #2629cb
--color-ink-purple: #c0abe0 / #59008e
--color-ink-pink: #fe90ff / #7b015d
--color-ink-comment: #aecbff / #4c3c93
--color-syntax-background: #0f051d / #f6d5d0
